import { 
  User,
  UpsertUser,
  Workspace,
  InsertWorkspace,
  WorkspaceMember,
  InsertWorkspaceMember,
  Project,
  InsertProject,
  ProjectComment,
  InsertProjectComment,
  ActivityLog,
  InsertActivityLog,
  Vendor,
  InsertVendor,
  users,
  workspaces,
  workspaceMembers,
  projects,
  projectComments,
  activityLog,
  vendors
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Workspace operations
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  updateWorkspace(id: string, updates: Partial<InsertWorkspace>): Promise<Workspace | undefined>;
  deleteWorkspace(id: string): Promise<boolean>;

  // Workspace member operations
  addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember>;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
  removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean>;
  updateMemberRole(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | undefined>;

  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getWorkspaceProjects(workspaceId: string): Promise<Project[]>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Comment operations
  addComment(comment: InsertProjectComment): Promise<ProjectComment>;
  getProjectComments(projectId: string): Promise<ProjectComment[]>;
  deleteComment(id: string): Promise<boolean>;

  // Activity log operations
  logActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  getWorkspaceActivity(workspaceId: string, limit?: number): Promise<ActivityLog[]>;
  getProjectActivity(projectId: string, limit?: number): Promise<ActivityLog[]>;

  // Vendor operations
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  getAllVendors(): Promise<Vendor[]>;
  getVendor(id: string): Promise<Vendor | undefined>;
  updateVendor(id: string, updates: Partial<InsertVendor>): Promise<Vendor | undefined>;
  deleteVendor(id: string): Promise<boolean>;
  searchVendors(query: string): Promise<Vendor[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Workspace operations
  async createWorkspace(workspace: InsertWorkspace): Promise<Workspace> {
    const [newWorkspace] = await db.insert(workspaces).values(workspace).returning();
    
    // Add the creator as the owner
    await this.addWorkspaceMember({
      workspaceId: newWorkspace.id,
      userId: workspace.ownerId,
      role: "owner"
    });

    return newWorkspace;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace || undefined;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const userWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        description: workspaces.description,
        ownerId: workspaces.ownerId,
        settings: workspaces.settings,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, userId));
    
    return userWorkspaces;
  }

  async updateWorkspace(id: string, updates: Partial<InsertWorkspace>): Promise<Workspace | undefined> {
    const [workspace] = await db
      .update(workspaces)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workspaces.id, id))
      .returning();
    return workspace || undefined;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    const result = await db.delete(workspaces).where(eq(workspaces.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Workspace member operations
  async addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember> {
    const [newMember] = await db.insert(workspaceMembers).values(member).returning();
    return newMember;
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return await db.select().from(workspaceMembers).where(eq(workspaceMembers.workspaceId, workspaceId));
  }

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(workspaceMembers)
      .where(and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async updateMemberRole(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | undefined> {
    const [member] = await db
      .update(workspaceMembers)
      .set({ role })
      .where(and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ))
      .returning();
    return member || undefined;
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    
    // Log activity
    await this.logActivity({
      workspaceId: project.workspaceId,
      projectId: newProject.id,
      userId: project.createdBy,
      action: "created_project",
      details: { projectName: project.name }
    });

    return newProject;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getWorkspaceProjects(workspaceId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .orderBy(desc(projects.createdAt));
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Comment operations
  async addComment(comment: InsertProjectComment): Promise<ProjectComment> {
    const [newComment] = await db.insert(projectComments).values(comment).returning();
    
    // Log activity
    await this.logActivity({
      projectId: comment.projectId,
      userId: comment.userId,
      action: "added_comment",
      details: { commentId: newComment.id }
    });

    return newComment;
  }

  async getProjectComments(projectId: string): Promise<ProjectComment[]> {
    return await db
      .select()
      .from(projectComments)
      .where(eq(projectComments.projectId, projectId))
      .orderBy(projectComments.createdAt);
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await db.delete(projectComments).where(eq(projectComments.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Activity log operations
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const [newActivity] = await db.insert(activityLog).values(activity).returning();
    return newActivity;
  }

  async getWorkspaceActivity(workspaceId: string, limit: number = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLog)
      .where(eq(activityLog.workspaceId, workspaceId))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
  }

  async getProjectActivity(projectId: string, limit: number = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLog)
      .where(eq(activityLog.projectId, projectId))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
  }

  // Vendor operations
  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  async getAllVendors(): Promise<Vendor[]> {
    return await db
      .select()
      .from(vendors)
      .orderBy(desc(vendors.createdAt));
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async updateVendor(id: string, updates: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const [vendor] = await db
      .update(vendors)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vendors.id, id))
      .returning();
    return vendor || undefined;
  }

  async deleteVendor(id: string): Promise<boolean> {
    const result = await db.delete(vendors).where(eq(vendors.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async searchVendors(query: string): Promise<Vendor[]> {
    const lowerQuery = query.toLowerCase();
    return await db
      .select()
      .from(vendors)
      .where(sql`
        LOWER(${vendors.name}) LIKE ${`%${lowerQuery}%`} OR
        LOWER(${vendors.city}) LIKE ${`%${lowerQuery}%`} OR
        LOWER(${vendors.category}) LIKE ${`%${lowerQuery}%`} OR
        LOWER(${vendors.description}) LIKE ${`%${lowerQuery}%`}
      `)
      .orderBy(desc(vendors.createdAt));
  }
}

export const storage = new DatabaseStorage();

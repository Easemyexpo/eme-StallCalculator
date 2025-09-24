import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, real, timestamp, uuid, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculatorSettings = pgTable("calculator_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currency: text("currency").notNull().default("USD"),
  marketLevel: text("market_level").notNull().default("medium"),
  // Location fields
  originCity: text("origin_city"),
  originState: text("origin_state"),
  destinationCity: text("destination_city"), 
  destinationState: text("destination_state"),
  eventType: text("event_type").notNull().default("trade"),
  eventDuration: integer("event_duration").notNull().default(3),
  distance: integer("distance").notNull().default(500),
  venueType: text("venue_type").notNull().default("standard"),
  boothSize: integer("booth_size").notNull().default(18),
  customSize: integer("custom_size"),
  boothType: text("booth_type").notNull().default("custom"),
  teamSize: integer("team_size").notNull().default(4),
  accommodationLevel: text("accommodation_level").notNull().default("business"),
  // Additional services as boolean flags
  furniture: boolean("furniture").notNull().default(false),
  avEquipment: boolean("av_equipment").notNull().default(false),
  lighting: boolean("lighting").notNull().default(false),
  internet: boolean("internet").notNull().default(false),
  storage: boolean("storage").notNull().default(false),
  security: boolean("security").notNull().default(false),
  createdAt: text("created_at").default(sql`now()`),
});

export const insertCalculatorSettingsSchema = createInsertSchema(calculatorSettings).omit({
  id: true,
  createdAt: true,
});

export type InsertCalculatorSettings = z.infer<typeof insertCalculatorSettingsSchema>;
export type CalculatorSettings = typeof calculatorSettings.$inferSelect;

// Event recommendation schemas
export const eventRecommendationRequest = z.object({
  industry: z.string().min(1, "Industry is required"),
  location: z.string().optional(),
  budget: z.number().optional(),
  teamSize: z.number().optional(),
  goals: z.array(z.string()).optional(),
  eventTypes: z.array(z.string()).optional(), // trade, consumer, hybrid
  companySize: z.enum(["startup", "sme", "enterprise"]).optional(),
  experience: z.enum(["first-time", "occasional", "experienced"]).optional(),
  timeline: z.string().optional(), // when they want to exhibit
});

export const eventRecommendation = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  industry: z.string(),
  location: z.string(),
  dates: z.string(),
  venue: z.string(),
  expectedVisitors: z.number(),
  averageBoothCost: z.number(),
  relevanceScore: z.number(),
  reasons: z.array(z.string()),
  benefits: z.array(z.string()),
  competitorPresence: z.enum(["low", "medium", "high"]),
  roiPotential: z.enum(["low", "medium", "high"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  website: z.string().optional(),
});

export const aiRecommendationResponse = z.object({
  recommendations: z.array(eventRecommendation),
  reasoning: z.string(),
  totalCount: z.number(),
  confidence: z.number(),
});

export type EventRecommendationRequest = z.infer<typeof eventRecommendationRequest>;
export type EventRecommendation = z.infer<typeof eventRecommendation>;
export type AIRecommendationResponse = z.infer<typeof aiRecommendationResponse>;

// Cost breakdown interface
export interface CostBreakdown {
  boothCost: number;
  constructionCost: number;
  travelCost: number;
  staffCost: number;
  marketingCost: number;
  logisticsCost: number;
  servicesCost: number;
  total: number;
  currency: string;
}

// Market multipliers and pricing data
export const MARKET_MULTIPLIERS = {
  low: 0.6,
  medium: 1.0,
  high: 1.4,
  premium: 2.0,
} as const;

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  SGD: 'S$',
  CHF: 'Fr',
} as const;

// External API Response Types
export interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  photos: string[];
  availability: boolean;
  distanceFromVenue: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  class: 'economy' | 'business' | 'first';
  stops: number;
  available: boolean;
}

export interface LogisticsQuote {
  id: string;
  provider: string;
  serviceType: 'ground' | 'air' | 'express';
  estimatedCost: number;
  currency: string;
  estimatedDays: number;
  trackingAvailable: boolean;
  insurance: boolean;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// API Request/Response schemas
export const hotelSearchSchema = z.object({
  city: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const flightSearchSchema = z.object({
  originCity: z.string(),
  destinationCity: z.string(),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  passengers: z.number().min(1),
  class: z.enum(['economy', 'business', 'first']).default('economy'),
});

export const logisticsQuoteSchema = z.object({
  originCity: z.string(),
  destinationCity: z.string(),
  weight: z.number(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  serviceType: z.enum(['ground', 'air', 'express']).default('ground'),
});

export type HotelSearchRequest = z.infer<typeof hotelSearchSchema>;
export type FlightSearchRequest = z.infer<typeof flightSearchSchema>;
export type LogisticsQuoteRequest = z.infer<typeof logisticsQuoteSchema>;

export type Currency = keyof typeof CURRENCY_SYMBOLS;
export type MarketLevel = keyof typeof MARKET_MULTIPLIERS;

// Team collaboration tables

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team workspaces for collaborative planning
export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").notNull(),
  settings: jsonb("settings"), // Store calculator settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members in workspaces
export const workspaceMembers = pgTable("workspace_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull().default("member"), // owner, admin, member, viewer
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Exhibition projects within workspaces
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  settings: jsonb("settings"), // Calculator settings specific to this project
  status: text("status").notNull().default("planning"), // planning, approved, active, completed
  budget: integer("budget"), // Total budget in cents
  currency: text("currency").notNull().default("USD"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments and discussions on projects
export const projectComments = pgTable("project_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  parentId: varchar("parent_id"), // For threaded conversations
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity log for tracking changes
export const activityLog = pgTable("activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  projectId: varchar("project_id"),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // created, updated, commented, etc.
  details: jsonb("details"), // Additional context about the action
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedWorkspaces: many(workspaces),
  workspaceMembers: many(workspaceMembers),
  projects: many(projects),
  comments: many(projectComments),
  activities: many(activityLog),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  projects: many(projects),
  activities: many(activityLog),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  comments: many(projectComments),
  activities: many(activityLog),
}));

export const projectCommentsRelations = relations(projectComments, ({ one, many }) => ({
  project: one(projects, {
    fields: [projectComments.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectComments.userId],
    references: [users.id],
  }),
  parent: one(projectComments, {
    fields: [projectComments.parentId],
    references: [projectComments.id],
  }),
  replies: many(projectComments),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [activityLog.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [activityLog.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
}));

// Types for collaborative features
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Vendors table for admin management
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  location: varchar("location"),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  description: text("description"),
  specialties: jsonb("specialties").default(sql`'[]'::jsonb`),
  services: jsonb("services").default(sql`'[]'::jsonb`),
  contact: jsonb("contact").default(sql`'{}'::jsonb`),
  rating: varchar("rating"),
  experience: varchar("experience"),
  priceRange: varchar("price_range").notNull().default("Standard"),
  keywords: jsonb("keywords").default(sql`'[]'::jsonb`),
  logoUrl: varchar("logo_url"),
  portfolioImages: jsonb("portfolio_images").default(sql`'[]'::jsonb`),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

// Exhibition data types
export interface Exhibition {
  id: string;
  name: string;
  industry: string[];
  venue: string;
  city: string;
  state: string;
  country: string;
  organizer: string;
  website?: string;
  frequency: 'Annual' | 'Biennial' | 'Quarterly';
  expectedVisitors: string;
  exhibitorCount: string;
  stallPricing: {
    shellScheme: string;
    rawSpace: string;
  };
  dates: {
    year: number;
    startDate: string;
    endDate: string;
  }[];
  description: string;
  keyFeatures: string[];
  targetAudience: string[];
  pastExhibitors?: string[];
}

export type InsertWorkspace = typeof workspaces.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;

export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export type InsertProjectComment = typeof projectComments.$inferInsert;
export type ProjectComment = typeof projectComments.$inferSelect;

export type InsertActivityLog = typeof activityLog.$inferInsert;
export type ActivityLog = typeof activityLog.$inferSelect;

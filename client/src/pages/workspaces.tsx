import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Calendar, Settings, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Workspace } from "@shared/schema";

export default function Workspaces() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: ""
  });

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["/api/workspaces"],
    enabled: isAuthenticated,
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return await apiRequest("/api/workspaces", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
      setIsCreateDialogOpen(false);
      setNewWorkspace({ name: "", description: "" });
      toast({
        title: "Workspace created",
        description: "Your new workspace has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workspace. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: "Error",
        description: "Workspace name is required.",
        variant: "destructive",
      });
      return;
    }
    createWorkspaceMutation.mutate(newWorkspace);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-green-800 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-300 mb-4">Please log in to access workspaces</p>
            <Button onClick={() => window.location.href = '/api/login'}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-green-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Team Workspaces</h1>
              <p className="text-gray-300">Collaborate with your team on exhibition projects</p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700" data-testid="button-new-workspace">
                <Plus className="w-4 h-4 mr-2" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Workspace</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Workspace Name</Label>
                  <Input
                    id="name"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                    placeholder="Enter workspace name"
                    className="bg-gray-700 border-gray-600 text-white"
                    data-testid="input-workspace-name"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                    placeholder="Describe the workspace purpose"
                    className="bg-gray-700 border-gray-600 text-white"
                    data-testid="input-workspace-description"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCreateWorkspace}
                    disabled={createWorkspaceMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-create-workspace"
                  >
                    {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-gray-600 text-gray-300"
                    data-testid="button-cancel-workspace"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Workspaces Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : workspaces && Array.isArray(workspaces) && workspaces.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(workspaces) && workspaces.map((workspace: Workspace) => (
              <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
                <Card 
                  className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer h-full"
                  data-testid={`card-workspace-${workspace.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{workspace.name}</CardTitle>
                        {workspace.description && (
                          <CardDescription className="text-gray-400">
                            {workspace.description}
                          </CardDescription>
                        )}
                      </div>
                      <Users className="w-5 h-5 text-green-400 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(workspace.createdAt!).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        Owner
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">No workspaces yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Create your first workspace to start collaborating with your team on exhibition projects.
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-create-first-workspace"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workspace
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Users, Plus, Settings, Activity } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-green-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {(user as any)?.firstName || 'User'}!
            </h1>
            <p className="text-gray-300">
              Manage your exhibition projects and collaborate with your team
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/workspaces">
              <Button className="bg-green-600 hover:bg-green-700" data-testid="button-workspaces">
                <Users className="w-4 h-4 mr-2" />
                Workspaces
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              onClick={() => window.location.href = '/api/logout'}
              data-testid="button-logout"
            >
              <Settings className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/calculator">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer" data-testid="card-calculator">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Cost Calculator</CardTitle>
                <CardDescription className="text-gray-400">
                  Calculate exhibition costs with AI-powered vendor recommendations
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/workspaces/new">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer" data-testid="card-new-workspace">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">New Workspace</CardTitle>
                <CardDescription className="text-gray-400">
                  Create a new team workspace for collaborative planning
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/workspaces">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer" data-testid="card-team-workspaces">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Team Workspaces</CardTitle>
                <CardDescription className="text-gray-400">
                  Access shared workspaces and collaborate with your team
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-green-400" />
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-gray-400 text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p>No recent activity</p>
              <p className="text-sm">Start by creating a workspace or calculating costs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
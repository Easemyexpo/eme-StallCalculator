import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Check credentials
    if (username === "admin" && password === "Arshika@123") {
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminSession", Date.now().toString());
      
      toast({
        title: "Welcome!",
        description: "Successfully logged into admin panel",
      });
      
      setLocation("/admin");
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your username and password",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-green-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/80 border-gray-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your credentials to access the vendor management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Enter username"
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                  data-testid="input-username"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                  data-testid="input-password"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
              data-testid="button-login"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white"
              data-testid="button-back-to-calculator"
            >
              ← Back to Calculator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Removed authentication - direct access enabled
import ExpoCalculator from "@/pages/expo-calculator-clean";
import StallDetails from "@/pages/stall-details";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Workspaces from "@/pages/workspaces";
import AdminPanel from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import { EventRecommendationsPage } from "@/pages/event-recommendations";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ExpoCalculator} />
      <Route path="/landing" component={Landing} />
      <Route path="/stall-details" component={StallDetails} />
      <Route path="/recommendations" component={EventRecommendationsPage} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

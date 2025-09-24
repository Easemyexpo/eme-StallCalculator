import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function AdminNav() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href="/admin">
        <Button
          size="sm"
          className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
          data-testid="button-admin-panel"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </Link>
    </div>
  );
}
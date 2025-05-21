"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="p-8 bg-card rounded-lg shadow-md text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard!</h1>
          {user && <p className="text-muted-foreground mb-2">Hello, {user.email || 'User'}!</p>}
          <p className="text-muted-foreground mb-6">
            This is a protected area of the application.
          </p>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage; 
'use client'

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MyLibrary = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useIsMobile();

  // Set collapsed state based on screen size initially
  React.useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isMobile={isMobile}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">My Library</h1>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Books</TabsTrigger>
              <TabsTrigger value="reading">Currently Reading</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                    <div className="h-32 w-24 bg-muted rounded flex items-center justify-center shrink-0">
                      <BookOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium">Book Title {i + 1}</h3>
                        <p className="text-sm text-muted-foreground">Author Name</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Fiction</span>
                        <span className="text-xs text-muted-foreground">240 pages</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reading">
              <p className="text-center py-10 text-muted-foreground">You aren&apos;t currently reading any books.</p>
            </TabsContent>
            
            <TabsContent value="completed">
              <p className="text-center py-10 text-muted-foreground">You haven&apos;t completed any books yet.</p>
            </TabsContent>
            
            <TabsContent value="wishlist">
              <p className="text-center py-10 text-muted-foreground">Your wishlist is empty.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MyLibrary;

'use client'
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { Headphones, PlayCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Audiobooks = () => {
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
          <h1 className="text-3xl font-bold mb-4">Audiobooks</h1>
          
          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Continue Listening</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-48 md:w-36 bg-muted rounded flex items-center justify-center shrink-0">
                <Headphones className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-medium">The Great Gatsby</h3>
                  <p className="text-muted-foreground">F. Scott Fitzgerald</p>
                  <p className="text-sm text-muted-foreground mt-2">Narrated by Jake Gyllenhaal</p>
                </div>
                <div className="mt-4">
                  <Progress value={35} className="mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2:15:32</span>
                    <span>6:24:18</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0">
                      <Clock size={16} />
                    </Button>
                    <Button className="rounded-full flex-1">
                      <PlayCircle className="mr-2" size={16} />
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Your Audiobook Library</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="h-40 md:h-48 bg-muted rounded flex items-center justify-center mb-2">
                  <Headphones className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-medium truncate">Audiobook Title {i + 1}</h3>
                <p className="text-sm text-muted-foreground truncate">Author Name</p>
                <div className="text-xs text-muted-foreground mt-1">6h 45m</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Audiobooks;

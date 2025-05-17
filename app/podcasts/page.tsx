'use client'

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { Mic, Play, Clock, BadgePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Podcasts = () => {
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
          <h1 className="text-3xl font-bold mb-4">Podcasts</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Button className="justify-start">
              <BadgePlus className="mr-2" size={16} />
              Discover Podcasts
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="mr-2" size={16} />
              Recent Episodes
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Subscribed Podcasts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-24 w-24 md:h-28 md:w-28 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Mic className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-center truncate w-full">Podcast {i + 1}</h3>
                <p className="text-xs text-muted-foreground text-center">Weekly</p>
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Latest Episodes</h2>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <Mic className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-medium">Episode Title {i + 1}</h3>
                      <p className="text-sm text-muted-foreground">Podcast Name</p>
                    </div>
                    <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                      <Play size={16} />
                    </Button>
                  </div>
                  <p className="text-sm mt-1 line-clamp-2">This is a short description of the episode content and what topics might be discussed...</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline">Science</Badge>
                    <span className="text-xs text-muted-foreground">46m</span>
                    <span className="text-xs text-muted-foreground">May 15</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Podcasts;

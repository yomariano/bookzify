'use client'

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { FileText, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Summaries = () => {
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
          <h1 className="text-3xl font-bold mb-4">Book Summaries</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search summaries" 
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter size={16} /> Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <CardTitle className="text-lg">Summary {i + 1}</CardTitle>
                    </div>
                    <Badge variant="outline" className="ml-2">5 min read</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <h4 className="font-medium mb-1">Book Title {i + 1}</h4>
                  <p className="text-sm text-muted-foreground mb-2">Author Name</p>
                  <p className="text-sm line-clamp-3">
                    This is a brief overview of the main ideas and key takeaways from the book.
                    The summary covers the most important concepts without going into excessive detail.
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4 justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary">Business</Badge>
                    <Badge variant="secondary">Productivity</Badge>
                  </div>
                  <Button size="sm" variant="ghost">Read</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Summaries;

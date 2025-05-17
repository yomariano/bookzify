'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Home, 
  Library, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Headphones,
  BookText, 
  Podcast,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/app/lib/utils';
interface SidebarProps {
  isMobile: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isMobile, isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <div 
      className={`bg-secondary/10 border-r border-border transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="ml-2 font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BookHub
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto">
            <BookOpen className="h-6 w-6 text-primary" />
          </Link>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        )}
      </div>
      
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Home" 
            href="/dashboard" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={<Library size={20} />} 
            label="My Library" 
            href="/library" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={<BookText size={20} />} 
            label="Summaries" 
            href="/summaries" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={<Headphones size={20} />} 
            label="Audiobooks" 
            href="/audiobooks" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={<Podcast size={20} />} 
            label="Podcasts" 
            href="/podcasts" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
          icon={<Settings size={20} />} 
          label="Settings" 
          href="/settings" 
          isCollapsed={isCollapsed} 
        />
        </nav>
      </div>
      
      <div className="p-2 mt-auto">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
}

function SidebarItem({ icon, label, href, isCollapsed }: SidebarItemProps) {
  return (
    <Link 
      href={href} 
      className={`flex items-center py-2 px-3 rounded-md text-foreground hover:bg-primary/10 transition-colors ${
        isCollapsed ? 'justify-center' : ''
      }`}
    >
      <span className="text-primary">{icon}</span>
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
} 
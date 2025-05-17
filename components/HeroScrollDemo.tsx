"use client";
import React from "react";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { Button } from "@/components/ui/button";
import { Book, Headphones, FileText, Globe, Award, Bookmark } from "lucide-react";
import Link from "next/link";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
              Welcome to <br />
              <span className="text-3xl sm:text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BookHub
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-base sm:text-lg">
              Your personal library in the cloud. Search, download, read, and experience books in new ways.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link href="/dashboard">
                <Button size="sm" className="rounded-full sm:text-base sm:size-lg">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="rounded-full sm:text-base sm:size-lg">
                Learn More
              </Button>
            </div>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="h-full flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1400&q=80"
              alt="Digital Library"
              className="object-cover h-full w-full"
            />
          </div>
          <div className="h-full bg-secondary/20 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Transform Your Reading Experience</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Feature 
                icon={<Book size={20} />} 
                title="Digital Library" 
                description="Store all your books in one place, accessible anywhere" 
              />
              <Feature 
                icon={<Headphones size={20} />} 
                title="Audio Books" 
                description="Convert any text to audio with natural-sounding voices" 
              />
              <Feature 
                icon={<FileText size={20} />} 
                title="AI Summaries" 
                description="Get concise summaries of any book with AI" 
              />
              <Feature 
                icon={<Globe size={20} />} 
                title="Kindle Integration" 
                description="Send books directly to your Kindle device" 
              />
              <Feature 
                icon={<Award size={20} />} 
                title="Reading Insights" 
                description="Track your reading habits and progress" 
              />
              <Feature 
                icon={<Bookmark size={20} />} 
                title="Book Clubs" 
                description="Join virtual book clubs with other readers" 
              />
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}

function Feature({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) {
  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="mt-1 bg-primary/10 p-1.5 sm:p-2 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

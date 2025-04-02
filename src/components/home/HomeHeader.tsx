// File path: /components/home/HomeHeader.tsx

import React from 'react';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { FolderPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const HomeHeader = () => {
  return (
    <div className="py-16 border-b border-photo-border bg-gradient-to-b from-photo-primary/90 to-photo-primary">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-photo-secondary mb-2">
              Welcome to PhotoVault
            </h1>
            <p className="text-photo-secondary/70 max-w-2xl">
              Discover and connect with other users. Click on a user to view their photo albums and explore their collections.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link href="/my-albums">
              <Button className="group bg-photo-indigo hover:bg-photo-indigo/90 gap-2">
                <FolderPlus className="h-4 w-4" />
                Create Your Collections
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-photo-border/10 flex flex-col sm:flex-row gap-4 sm:gap-8 sm:items-center text-sm text-photo-secondary/60">
          <div className="flex gap-2 items-center">
            <div className="h-6 w-6 rounded-full bg-photo-indigo/20 flex items-center justify-center">
              <span className="text-xs font-medium text-photo-indigo">1</span>
            </div>
            <span>Browse user profiles</span>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="h-6 w-6 rounded-full bg-photo-indigo/20 flex items-center justify-center">
              <span className="text-xs font-medium text-photo-indigo">2</span>
            </div>
            <span>Explore their photo collections</span>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="h-6 w-6 rounded-full bg-photo-indigo/20 flex items-center justify-center">
              <span className="text-xs font-medium text-photo-indigo">3</span>
            </div>
            <span>Create and share your own albums</span>
          </div>
        </div>
      </Container>
    </div>
  );
};
import React from 'react';
import Container from '@/components/common/Container';

export const HomeHeader = () => {
  return (
    <div className="py-16 border-b border-photo-border bg-gradient-to-b from-photo-primary/90 to-photo-primary">
      <Container>
        <h1 className="text-3xl md:text-4xl font-bold text-photo-secondary mb-2">
          Welcome to PhotoVault
        </h1>
        <p className="text-photo-secondary/70 max-w-2xl">
          Discover and connect with other users. Click on a user to view their photo albums and explore their collections.
        </p>
      </Container>
    </div>
  );
};
import React from 'react';
import { UserNav } from '@/components/common/navigation/UserNav';
import { MainNav } from '@/components/common/navigation/MainNav';
import { MobileNav } from '@/components/common/navigation/MobileNav';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import Container from '@/components/common/Container';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <div className="flex min-h-screen flex-col bg-photo-primary">
        <header className="sticky top-0 z-50 py-4 backdrop-blur-sm bg-photo-primary/80">
          <Container>
            <div className="flex items-center justify-between py-2 px-4 bg-photo-darkgray/30 border border-photo-border/20 rounded-lg">
              <MainNav />
              <div className="hidden md:block">
                <UserNav />
              </div>
              <div className="md:hidden">
                <MobileNav />
              </div>
            </div>
          </Container>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </AuthWrapper>
  );
}
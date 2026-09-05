'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { StudyHubProvider } from '@/context/StudyHubContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ResourceModal } from '@/components/ResourceModal';
import { AddModuleModal } from '@/components/AddModuleModal';
import { EditModuleModal } from '@/components/EditModuleModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Study HUB - Academic Materials & Lab Tracking</title>
        <meta
          name="description"
          content="Centralized academic study hub for Computer Systems and Network Engineering (CSNE) degree materials, lecture slides, tutorials, and lab configurations."
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased transition-colors">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <StudyHubProvider>
            <div className="flex min-h-screen">
              {/* Sidebar Component */}
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              {/* Main Content Workspace */}
              <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
                <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                  {children}
                </main>
              </div>
            </div>

            {/* Global Modals */}
            <ResourceModal />
            <AddModuleModal />
            <EditModuleModal />
          </StudyHubProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

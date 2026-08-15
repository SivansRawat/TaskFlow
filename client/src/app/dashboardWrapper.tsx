"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./authProvider";
import StoreProvider, { useAppSelector } from "./redux";
import WebGLBackground from "@/components/WebGLBackground";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  useEffect(() => {
    // Enforce dark mode as the visual system foundation
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="relative flex min-h-screen w-full bg-[#09090B] text-white">
      {/* Background layer */}
      <WebGLBackground />

      {/* Foreground layout */}
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <main
          className={`flex w-full flex-col bg-transparent transition-all duration-300 ${
            isSidebarCollapsed ? "" : "md:pl-64"
          }`}
        >
          <Navbar />
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;

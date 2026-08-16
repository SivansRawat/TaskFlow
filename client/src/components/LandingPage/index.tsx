"use client";

import React from "react";
import Logo from "@/components/Logo";
import SpectrumSimulation from "./SpectrumSimulation";
import { ArrowRight, Kanban, Calendar, BarChart3, Users, ShieldCheck, Zap } from "lucide-react";

interface LandingPageProps {
  onOpenAuth: (mode?: "signin" | "signup") => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="w-full min-h-screen text-white bg-[#09090B] selection:bg-[#FBBF24] selection:text-black font-sans overflow-x-hidden">
      
      {/* Navigation Header */}
      <header className="relative z-20 border-b border-white/10 bg-[#09090B]/80 backdrop-blur-md sticky top-0 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={34} />
          <span className="text-sm font-bold tracking-widest uppercase font-mono text-white">
            TASKFLOW
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenAuth("signin")}
            className="px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={() => onOpenAuth("signup")}
            className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          >
            <span>LAUNCH APP</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION — TAILORED TASKFLOW CONTENT WITH EDITORIAL LAYOUT */}
      <section className="relative z-10 pt-12 lg:pt-20 pb-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
        
        {/* Split 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch min-h-[580px]">
          
          {/* Left Column: Headline, Subtitle, CTA & 3 Feature Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            
            <div>
              {/* Headline */}
              <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-bold text-white tracking-tight leading-[1.02]">
                Orchestrating <br />
                <span className="text-[#FBBF24] drop-shadow-[0_0_30px_rgba(251,191,36,0.35)]">
                  adaptive
                </span> <br />
                velocity.
              </h1>

              {/* Subtitle */}
              <p className="mt-8 text-base sm:text-lg text-white/60 leading-relaxed font-normal max-w-xl">
                Transforming complex sprint operations into real-time workspace engines that track milestones, balance team workloads, and eliminate project friction.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenAuth("signup")}
                  className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-6 py-3 text-xs font-bold text-black hover:bg-[#F59E0B] transition-all shadow-[0_0_25px_rgba(251,191,36,0.35)]"
                >
                  <span>GET STARTED</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onOpenAuth("signin")}
                  className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold text-white hover:bg-white/10 transition-all backdrop-blur-md"
                >
                  EXPLORE PLATFORM
                </button>
              </div>
            </div>

            {/* Bottom 3 Feature Pillars */}
            <div className="pt-10 border-t border-white/10 mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Pillar 1 */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[#FBBF24] bg-[#09090B]"></span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Agile Boards</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Interactive Kanban workflows with custom status stages and dynamic priority tags.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[#FBBF24] bg-[#09090B]"></span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Gantt Timelines</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Multi-resolution roadmaps tracking project milestones across Days, Weeks, and Months.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[#FBBF24] bg-[#09090B]"></span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Workload Allocation</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Real-time team analytics balancing capacity and member assignments across sprints.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Direct Unboxed Moving Animation Bleed */}
          <div className="lg:col-span-6 flex items-end justify-center">
            <SpectrumSimulation />
          </div>

        </div>
      </section>

      {/* DETAILED FEATURES MATRIX GRID */}
      <section id="features" className="relative z-10 py-20 px-6 lg:px-12 max-w-[1440px] mx-auto border-t border-white/10">
        <div className="text-left mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight uppercase">
            ENGINEERED FOR WORKSPACE VELOCITY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-lg bg-[#18181B]/80 border border-white/10 p-6 transition-all duration-200 hover:border-[#FBBF24]/40 hover:bg-[#18181B]">
            <div className="h-10 w-10 rounded-md bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] mb-4">
              <Kanban className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Agile Kanban Boards</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Organize sprint cycles, manage column status categories, and configure high-priority labels dynamically.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg bg-[#18181B]/80 border border-white/10 p-6 transition-all duration-200 hover:border-[#FBBF24]/40 hover:bg-[#18181B]">
            <div className="h-10 w-10 rounded-md bg-[#A5FF2A]/10 border border-[#A5FF2A]/30 flex items-center justify-center text-[#A5FF2A] mb-4">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Interactive Gantt</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Track project milestones and roadmap schedules with simple toggles across Day, Week, and Month scales.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg bg-[#18181B]/80 border border-white/10 p-6 transition-all duration-200 hover:border-[#FBBF24]/40 hover:bg-[#18181B]">
            <div className="h-10 w-10 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Priority Analytics</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              View task status allocations, filter workloads, and identify bottlenecks with charts built for clarity.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-lg bg-[#18181B]/80 border border-white/10 p-6 transition-all duration-200 hover:border-white/30 hover:bg-[#18181B]">
            <div className="h-10 w-10 rounded-md bg-white/5 border border-white/15 flex items-center justify-center text-white mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Multi-Tenant Isolation</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Strict boundary enforcement locks user accounts, team structures, and database items to organization nodes.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-lg bg-[#18181B]/80 border border-white/10 p-6 transition-all duration-200 hover:border-[#FBBF24]/40 hover:bg-[#18181B]">
            <div className="h-10 w-10 rounded-md bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Smart Notifications</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Receive notifications for critical deadline approaches, urgent status flags, and sprint team modifications.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-lg bg-[#18181B]/80 border border-white/10 p-6 transition-all duration-200 hover:border-[#FBBF24]/40 hover:bg-[#18181B]">
            <div className="h-10 w-10 rounded-md bg-[#A5FF2A]/10 border border-[#A5FF2A]/30 flex items-center justify-center text-[#A5FF2A] mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Enterprise Operations</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Prisma ORM data structures, secure session keys, input schema controls, and production-ready latency bounds.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="relative z-10 py-20 px-6 lg:px-12 max-w-5xl mx-auto text-center border-t border-white/10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight">
          OVERSEE SPRINT OPERATIONS TODAY.
        </h2>
        <p className="mt-4 text-sm text-white/60 max-w-xl mx-auto">
          Deploy tasks, synchronize team workloads, and visualize roadmaps with absolute design clarity.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onOpenAuth("signup")}
            className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-8 py-3.5 text-xs font-bold text-black hover:bg-[#F59E0B] transition-all shadow-[0_0_25px_rgba(251,191,36,0.35)]"
          >
            <span>CREATE FREE ACCOUNT</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

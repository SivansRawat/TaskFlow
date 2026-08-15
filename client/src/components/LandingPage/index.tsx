"use client";

import React from "react";
import Logo from "@/components/Logo";
import { ArrowRight, Kanban, Calendar, BarChart3, Users, ShieldCheck, Zap } from "lucide-react";

interface LandingPageProps {
  onOpenAuth: (mode?: "signin" | "signup") => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="w-full min-h-screen text-white bg-transparent selection:bg-[#FBBF24] selection:text-black">
      
      {/* Navigation Header */}
      <header className="relative z-20 border-b border-white/12 bg-[#09090B]/60 backdrop-blur-md sticky top-0 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-sm font-bold tracking-widest uppercase font-mono text-white">TASKFLOW</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenAuth("signin")}
            className="px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={() => onOpenAuth("signup")}
            className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-all"
          >
            <span>LAUNCH APP</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-24 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#18181B] px-3.5 py-1 text-[11px] font-semibold text-[#FBBF24] mb-8 uppercase tracking-wider font-mono">
          <span>Enterprise Workspace Orchestrator</span>
        </div>

        <h1 className="text-display-lg text-white max-w-6xl mx-auto leading-[1.05] tracking-tight">
          OPERATIONAL SPEED <br />
          <span className="text-[#FBBF24]">WITHOUT FRICTION.</span>
        </h1>

        <p className="mt-8 text-base sm:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed font-normal">
          TaskFlow implements rigorous data isolation, agile sprint scheduling, real-time Gantt tracking, and multi-team resource allocation inside a technical interface designed for high-throughput teams.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={() => onOpenAuth("signin")}
            className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-6 py-3 text-sm font-bold text-black hover:bg-[#F59E0B] transition-all"
          >
            GET STARTED
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => onOpenAuth("signin")}
            className="flex items-center gap-2 rounded-md border border-white/12 bg-[#18181B]/80 px-6 py-3 text-sm font-semibold text-white hover:bg-[#27272A] transition-all"
          >
            QUICK DEMO
          </button>
        </div>
      </section>

      {/* DETAILED FEATURES MATRIX GRID */}
      <section id="features" className="relative z-10 py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/8/80">
        <div className="text-left mb-12">
          <span className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-widest font-mono">01 // CAPABILITIES</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 uppercase tracking-tight">
            ENGINEERED FOR WORKSPACE VELOCITY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-lg bg-[#18181B] border border-white/12 p-6 transition-all duration-150 hover:border-white/20">
            <div className="h-9 w-9 rounded-md bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24] mb-4">
              <Kanban className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Agile Kanban Boards</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Organize sprint cycles, manage column status categories, and configure high-priority labels dynamically.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg bg-[#18181B] border border-white/12 p-6 transition-all duration-150 hover:border-white/20">
            <div className="h-9 w-9 rounded-md bg-[#A5FF2A]/10 border border-[#A5FF2A]/20 flex items-center justify-center text-[#A5FF2A] mb-4">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Interactive Gantt</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Track project milestones and roadmap schedules with simple toggles across Day, Week, and Month scales.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg bg-[#18181B] border border-white/12 p-6 transition-all duration-150 hover:border-white/20">
            <div className="h-9 w-9 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Priority Analytics</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              View task status allocations, filter workloads, and identify bottlenecks with charts built for clarity.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-lg bg-[#18181B] border border-white/12 p-6 transition-all duration-150 hover:border-white/20">
            <div className="h-9 w-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Multi-Tenant Isolation</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Strict boundary enforcement locks user accounts, team structures, and database items to organization nodes.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-lg bg-[#18181B] border border-white/12 p-6 transition-all duration-150 hover:border-white/20">
            <div className="h-9 w-9 rounded-md bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24] mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Smart Notifications</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Receive notifications for critical deadline approaches, urgent status flags, and sprint team modifications.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-lg bg-[#18181B] border border-white/12 p-6 transition-all duration-150 hover:border-white/20">
            <div className="h-9 w-9 rounded-md bg-[#A5FF2A]/10 border border-[#A5FF2A]/20 flex items-center justify-center text-[#A5FF2A] mb-4">
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
      <section className="relative z-10 py-20 px-6 lg:px-12 max-w-5xl mx-auto text-center border-t border-white/8/80">
        <span className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-widest font-mono">02 // DEPLOYMENT</span>
        <h2 className="text-3xl font-bold text-white mt-2 uppercase tracking-tight">
          OVERSEE SPRINT OPERATIONS TODAY.
        </h2>
        <p className="mt-4 text-sm text-white/60 max-w-xl mx-auto">
          Deploy tasks, synchronize team workloads, and visualize roadmaps with absolute design clarity.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onOpenAuth("signup")}
            className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-8 py-3.5 text-xs font-bold text-black hover:bg-[#F59E0B] transition-all"
          >
            CREATE FREE ACCOUNT
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

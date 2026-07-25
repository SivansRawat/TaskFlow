"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  Kanban,
  Calendar,
  BarChart3,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  Layers,
  Clock,
  Star,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface LandingPageProps {
  onOpenAuth: (mode?: "signin" | "signup") => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<"kanban" | "timeline" | "analytics">("kanban");

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
      </div>

      {/* Navigation Bar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-xl font-black tracking-wider text-white">TASKFLOW</span>
          <span className="ml-2 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
            v2.0
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#preview" className="hover:text-blue-400 transition-colors">Interactive Demo</a>
          <a href="#workflow" className="hover:text-blue-400 transition-colors">Workflow</a>
          <a href="#stats" className="hover:text-blue-400 transition-colors">Metrics</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth("signin")}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
          >
            Sign In
          </button>

          <button
            onClick={() => onOpenAuth("signup")}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started / Login</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-20 pb-24 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-800 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-8 backdrop-blur-sm shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          <span>Next-Generation Agile & Workspace Suite</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Manage Projects & Tasks with <br className="hidden sm:inline" />
          <span className="text-blue-400 sm:text-transparent sm:bg-gradient-to-r sm:from-blue-400 sm:via-cyan-300 sm:to-indigo-300 sm:bg-clip-text font-black inline-block mt-2">
            Unmatched Speed & Clarity
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          TaskFlow gives your engineering, design, and product teams clear visibility into project timelines, task priorities, team workloads, and interactive Gantt charts.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={() => onOpenAuth("signin")}
            className="flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-extrabold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105"
          >
            <LayoutDashboard className="h-5 w-5" />
            Get Started / Login
          </button>

          <a
            href="#preview"
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-3.5 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all"
          >
            Explore Features Demo
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        {/* Hero Badge Row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400 border-t border-slate-800/60 pt-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Real-time Gantt & Kanban Sync
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Multi-Team Workspace Allocation
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Interactive Priority Analytics
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO PREVIEW SECTION */}
      <section id="preview" className="relative z-10 py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Mock Window Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-medium text-slate-400 font-mono">
                taskflow.app/workspace/dashboard
              </span>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab("kanban")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeTab === "kanban"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Kanban className="h-3.5 w-3.5" /> Board View
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeTab === "timeline"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" /> Timeline View
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeTab === "analytics"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" /> Analytics View
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="mt-6">
            {activeTab === "kanban" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400" /> To Do (3)
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 shadow-sm hover:border-blue-500/50 transition">
                      <span className="rounded bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 text-[10px] font-bold">
                        Urgent
                      </span>
                      <h4 className="mt-2 text-sm font-semibold text-white">Optimize API Response Latency</h4>
                      <p className="mt-1 text-xs text-slate-400">Implement Redis caching layer for task lists.</p>
                    </div>
                    <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 shadow-sm hover:border-blue-500/50 transition">
                      <span className="rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold">
                        Medium
                      </span>
                      <h4 className="mt-2 text-sm font-semibold text-white">Design Mobile Navigation</h4>
                      <p className="mt-1 text-xs text-slate-400">Create sticky bottom bar layout components.</p>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400" /> In Progress (2)
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 shadow-sm border-l-4 border-l-blue-500">
                      <span className="rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 text-[10px] font-bold">
                        High
                      </span>
                      <h4 className="mt-2 text-sm font-semibold text-white">Refactor Timeline View</h4>
                      <p className="mt-1 text-xs text-slate-400">Add Day / Week / Month view toggle & Gantt styling.</p>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" /> Completed (4)
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 shadow-sm opacity-80">
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                        Done
                      </span>
                      <h4 className="mt-2 text-sm font-semibold text-white line-through">Setup Express Middleware</h4>
                      <p className="mt-1 text-xs text-slate-400">Added global error handlers & CORS security.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="rounded-xl bg-slate-950/60 p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" /> Project Timeline & Gantt Schedule
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300">Month View</span>
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300">Week View</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Project Alpha Release</span>
                      <span>75% Completed</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[75%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Backend Security Audit & CORS</span>
                      <span>100% Completed</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[100%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Mobile Responsive Navigation</span>
                      <span>40% Completed</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full w-[40%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Velocity</span>
                  <div className="mt-2 text-3xl font-black text-white">+42%</div>
                  <span className="text-xs text-emerald-400 mt-1 block">↑ Higher task throughput</span>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase">On-Time Completion</span>
                  <div className="mt-2 text-3xl font-black text-white">96.8%</div>
                  <span className="text-xs text-blue-400 mt-1 block">Target deadlines hit</span>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Active Workspaces</span>
                  <div className="mt-2 text-3xl font-black text-white">100%</div>
                  <span className="text-xs text-purple-400 mt-1 block">Live team sync</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="relative z-10 py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Built for Modern Teams & High-Performance Projects
          </h2>
          <p className="mt-3 text-slate-400 text-base max-w-2xl mx-auto">
            Everything you need to orchestrate complex tasks, monitor milestone deadlines, and align your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
              <Kanban className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Kanban & Sprint Boards</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Visualize tasks with customizable status columns, drag-and-drop ordering, and instant priority tagging.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Gantt Timeline</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seamlessly toggle between Day, Week, and Month views to track multi-week project schedules.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Gain deep insight into task status distributions, priority bottlenecks, and overall team workload.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Team & Member Allocations</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Organize members into specialized teams, assign product managers, and track individual contributions.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Priority Smart Alerts</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Flag urgent tasks, monitor approaching due dates, and ensure high-priority items get immediate attention.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Secure API & Robust Backend</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hardened Express REST backend with Prisma ORM, input validation, and secure cross-origin isolation.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="relative z-10 py-20 px-6 lg:px-12 max-w-5xl mx-auto text-center border-t border-slate-800/80">
        <h2 className="text-3xl sm:text-5xl font-black text-white">
          Ready to Take Your Workflow to the Next Level?
        </h2>
        <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto">
          Start creating projects, assigning team tasks, and visualizing timeline deadlines today.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onOpenAuth("signup")}
            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105"
          >
            Get Started / Login
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

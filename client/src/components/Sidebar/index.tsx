"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery, useGetProjectsQuery } from "@/state/api";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import ModalNewProject from "@/app/projects/ModalNewProject";
import Logo from "@/components/Logo";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const { data: currentUser } = useGetAuthUserQuery(undefined);
  const currentUserDetails = currentUser?.userDetails;

  const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-xl
    transition-all duration-300 z-50 overflow-y-auto bg-white border-r border-slate-200/80 dark:border-slate-800/80 dark:bg-slate-950
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  return (
    <div className={sidebarClassNames}>
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="flex h-full w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[60px] w-64 items-center justify-between px-6 pt-4 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white">
              <Logo size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white font-mono">
                TASKFLOW
              </span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                ENTERPRISE
              </span>
            </div>
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ACTIVE TEAM / WORKSPACE BADGE */}
        <div className="mx-4 my-4 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </h3>
            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
              Engineering Team
            </p>
          </div>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
        </div>

        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full space-y-0.5 px-3">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        {/* PROJECTS LINKS */}
        <div className="mt-4 flex w-full items-center justify-between px-6 py-2">
          <button
            onClick={() => setShowProjects((prev) => !prev)}
            className="flex items-center gap-2 font-bold tracking-wider text-[11px] uppercase text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <span>Projects ({projects?.length || 0})</span>
            {showProjects ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
            title="Create New Project"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {/* PROJECTS LIST */}
        {showProjects && (
          <div className="space-y-0.5 px-3">
            {projects?.map((project) => (
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/projects/${project.id}`}
              />
            ))}
          </div>
        )}

        {/* PRIORITIES LINKS */}
        <div className="mt-4 flex w-full items-center justify-between px-6 py-2">
          <button
            onClick={() => setShowPriority((prev) => !prev)}
            className="flex items-center gap-2 font-bold tracking-wider text-[11px] uppercase text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <span>Priority Views</span>
            {showPriority ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        {showPriority && (
          <div className="space-y-0.5 px-3 pb-6">
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
          isActive
            ? "bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 font-bold"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100"
        }`}
      >
        <Icon className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;

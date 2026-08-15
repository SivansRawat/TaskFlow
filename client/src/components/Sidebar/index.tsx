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

  const sidebarClassNames = `fixed flex flex-col h-full justify-between
    transition-all duration-300 z-50 overflow-y-auto bg-[#09090B]/90 backdrop-blur-md border-r border-white/12
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
        <div className="z-50 flex min-h-[60px] w-64 items-center justify-between px-6 pt-4 bg-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#18181B] border border-white/12 text-white">
              <Logo size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-white font-mono">
                TASKFLOW
              </span>
              <span className="text-[8px] font-bold text-[#FBBF24] uppercase tracking-widest font-mono">
                OPERATIONAL
              </span>
            </div>
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ACTIVE TEAM / WORKSPACE BADGE */}
        <div className="mx-4 my-4 flex items-center gap-3 rounded-md border border-white/10 bg-[#18181B]/60 p-3 shadow-inner">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24]">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-[9px] font-bold uppercase tracking-wider text-white/40 font-mono">
              Workspace
            </h3>
            <p className="truncate text-xs font-bold text-white">
              Engineering Team
            </p>
          </div>
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#A5FF2A] ring-2 ring-[#A5FF2A]/20" />
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
            className="flex items-center gap-2 font-bold tracking-wider text-[10px] uppercase text-white/40 hover:text-white/60 transition"
          >
            <span>Projects ({projects?.length || 0})</span>
            {showProjects ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white transition"
            title="Create New Project"
          >
            <Plus className="h-3.5 w-3.5" />
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
            className="flex items-center gap-2 font-bold tracking-wider text-[10px] uppercase text-white/40 hover:text-white/60 transition"
          >
            <span>Priority Views</span>
            {showPriority ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
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
  const isActive = pathname === href;

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold transition-all duration-150 ${
          isActive
            ? "bg-[#FBBF24]/10 text-[#FBBF24] border-l-2 border-l-[#FBBF24] font-bold"
            : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className={`h-4 w-4 ${isActive ? "text-[#FBBF24]" : "text-white/40"}`} />
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;

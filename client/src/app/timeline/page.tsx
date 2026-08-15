"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import { Calendar, Search, Filter, Layers, Clock, PlusSquare } from "lucide-react";
import ModalNewProject from "@/app/projects/ModalNewProject";

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery.trim()) return projects;
    return projects.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [projects, searchQuery]);

  const ganttTasks = useMemo(() => {
    return (
      filteredProjects.map((project) => {
        const start = project.startDate ? new Date(project.startDate) : new Date();
        const end = project.endDate
          ? new Date(project.endDate)
          : new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);

        const safeStart = isNaN(start.getTime()) ? new Date() : start;
        const safeEnd =
          isNaN(end.getTime()) || end <= safeStart
            ? new Date(safeStart.getTime() + 14 * 24 * 60 * 60 * 1000)
            : end;

        return {
          start: safeStart,
          end: safeEnd,
          name: project.name,
          id: `Project-${project.id}`,
          type: "project" as TaskTypeItems,
          progress: 60,
          isDisabled: false,
        };
      }) || []
    );
  }, [filteredProjects]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center p-8 font-semibold text-[#FBBF24]">
        <div className="flex items-center gap-3 font-mono text-sm tracking-wide">
          <Clock className="h-5 w-5 animate-spin text-[#FBBF24]" />
          LOADING PROJECTS TIMELINE...
        </div>
      </div>
    );
  }

  if (isError || !projects) {
    return (
      <div className="p-8 text-center text-red-400 font-semibold">
        An error occurred while fetching project timelines.
      </div>
    );
  }

  return (
    <div className="max-w-full p-6 sm:p-8 bg-transparent">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      {/* Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Header name="Projects Timeline & Gantt Roadmap" />
          <p className="mt-1 text-xs text-white/50">
            Visualize multi-week project schedules, milestone targets, and delivery dates.
          </p>
        </div>

        <button
          onClick={() => setIsModalNewProjectOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
        >
          <PlusSquare className="h-4 w-4" /> Add Project
        </button>
      </div>

      {/* Controls Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/12 bg-[#18181B]/75 p-4 backdrop-blur-md text-white shadow-lg">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search timeline projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-white/12 bg-[#09090B] pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
          />
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1 rounded-md bg-[#09090B] p-1 border border-white/10">
          <button
            onClick={() =>
              setDisplayOptions((prev) => ({ ...prev, viewMode: ViewMode.Day }))
            }
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
              displayOptions.viewMode === ViewMode.Day
                ? "bg-[#FBBF24] text-black shadow"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Day
          </button>

          <button
            onClick={() =>
              setDisplayOptions((prev) => ({ ...prev, viewMode: ViewMode.Week }))
            }
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
              displayOptions.viewMode === ViewMode.Week
                ? "bg-[#FBBF24] text-black shadow"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Week
          </button>

          <button
            onClick={() =>
              setDisplayOptions((prev) => ({ ...prev, viewMode: ViewMode.Month }))
            }
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
              displayOptions.viewMode === ViewMode.Month
                ? "bg-[#FBBF24] text-black shadow"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="overflow-hidden rounded-lg border border-white/12 bg-[#18181B]/75 backdrop-blur-md shadow-lg">
        {ganttTasks.length > 0 ? (
          <div className="timeline p-2">
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={
                displayOptions.viewMode === ViewMode.Month
                  ? 140
                  : displayOptions.viewMode === ViewMode.Week
                  ? 100
                  : 65
              }
              listCellWidth="160px"
              projectBackgroundColor="#FBBF24"
              projectProgressColor="#F59E0B"
              projectProgressSelectedColor="#D97706"
            />
          </div>
        ) : (
          <div className="p-12 text-center backdrop-blur-md bg-transparent">
            <Calendar className="mx-auto h-12 w-12 text-white/20" />
            <h3 className="mt-3 text-base font-bold text-white uppercase tracking-wider">
              No Projects Found on Timeline
            </h3>
            <p className="mt-1 text-xs text-white/40">
              {searchQuery
                ? `No projects matched "${searchQuery}"`
                : "Create a new project to start scheduling delivery milestones."}
            </p>
            <button
              onClick={() => setIsModalNewProjectOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
            >
              <PlusSquare className="h-4 w-4" /> Create First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;


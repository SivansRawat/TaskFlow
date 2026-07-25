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
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
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
      <div className="flex h-96 items-center justify-center p-8 font-semibold text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 animate-spin text-blue-600" />
          Loading Projects Timeline...
        </div>
      </div>
    );
  }

  if (isError || !projects) {
    return (
      <div className="p-8 text-center text-red-500">
        An error occurred while fetching project timelines.
      </div>
    );
  }

  return (
    <div className="max-w-full p-6 sm:p-8">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      {/* Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Header name="Projects Timeline & Gantt Roadmap" />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Visualize multi-week project schedules, milestone targets, and delivery dates.
          </p>
        </div>

        <button
          onClick={() => setIsModalNewProjectOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
        >
          <PlusSquare className="h-4 w-4" /> Add Project
        </button>
      </div>

      {/* Controls Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow dark:bg-dark-secondary dark:text-white border border-gray-200/80 dark:border-neutral-800">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search timeline projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-9 pr-4 py-2 text-xs text-gray-800 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
          <button
            onClick={() =>
              setDisplayOptions((prev) => ({ ...prev, viewMode: ViewMode.Day }))
            }
            className={`flex items-center gap-1 rounded.5 px-3 py-1.5 text-xs font-semibold transition ${
              displayOptions.viewMode === ViewMode.Day
                ? "bg-white text-blue-600 shadow dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Day
          </button>

          <button
            onClick={() =>
              setDisplayOptions((prev) => ({ ...prev, viewMode: ViewMode.Week }))
            }
            className={`flex items-center gap-1 rounded.5 px-3 py-1.5 text-xs font-semibold transition ${
              displayOptions.viewMode === ViewMode.Week
                ? "bg-white text-blue-600 shadow dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Week
          </button>

          <button
            onClick={() =>
              setDisplayOptions((prev) => ({ ...prev, viewMode: ViewMode.Month }))
            }
            className={`flex items-center gap-1 rounded.5 px-3 py-1.5 text-xs font-semibold transition ${
              displayOptions.viewMode === ViewMode.Month
                ? "bg-white text-blue-600 shadow dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-dark-secondary border border-gray-200/80 dark:border-neutral-800">
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
              projectBackgroundColor={isDarkMode ? "#2563EB" : "#3B82F6"}
              projectProgressColor={isDarkMode ? "#1D4ED8" : "#2563EB"}
              projectProgressSelectedColor={isDarkMode ? "#1E40AF" : "#1D4ED8"}
            />
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300 dark:text-neutral-600" />
            <h3 className="mt-3 text-base font-bold text-gray-800 dark:text-white">
              No Projects Found on Timeline
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {searchQuery
                ? `No projects matched "${searchQuery}"`
                : "Create a new project to start scheduling delivery milestones."}
            </p>
            <button
              onClick={() => setIsModalNewProjectOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
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


import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import { Plus, Calendar, Clock } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      tasks?.map((task) => {
        const start = task.startDate ? new Date(task.startDate) : new Date();
        const end = task.dueDate
          ? new Date(task.dueDate)
          : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

        const safeStart = isNaN(start.getTime()) ? new Date() : start;
        const safeEnd =
          isNaN(end.getTime()) || end <= safeStart
            ? new Date(safeStart.getTime() + 7 * 24 * 60 * 60 * 1000)
            : end;

        return {
          start: safeStart,
          end: safeEnd,
          name: task.title,
          id: `Task-${task.id}`,
          type: "task" as TaskTypeItems,
          progress: task.status === "Completed" ? 100 : task.points ? Math.min((task.points / 10) * 100, 90) : 30,
          isDisabled: false,
        };
      }) || []
    );
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-6 text-sm font-semibold text-gray-500 dark:text-gray-400">
        <Clock className="mr-2 h-4 w-4 animate-spin text-blue-600" />
        Loading Project Timeline...
      </div>
    );
  }

  if (error || !tasks) {
    return (
      <div className="p-6 text-center text-red-500">
        An error occurred while fetching tasks for this timeline.
      </div>
    );
  }

  return (
    <div className="px-4 xl:px-6 py-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div>
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">
            Project Task Schedule
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tasks.length} total tasks scheduled across sprint timeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Pill View Switcher */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
            <button
              onClick={() =>
                setDisplayOptions((prev) => ({ ...prev, viewMode: ViewMode.Day }))
              }
              className={`rounded px-3 py-1 text-xs font-semibold transition ${
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
              className={`rounded px-3 py-1 text-xs font-semibold transition ${
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
              className={`rounded px-3 py-1 text-xs font-semibold transition ${
                displayOptions.viewMode === ViewMode.Month
                  ? "bg-white text-blue-600 shadow dark:bg-neutral-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={() => setIsModalNewTaskOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-dark-secondary border border-gray-200/80 dark:border-neutral-800">
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
              listCellWidth="150px"
              barBackgroundColor={isDarkMode ? "#3B82F6" : "#2563EB"}
              barBackgroundSelectedColor={isDarkMode ? "#2563EB" : "#1D4ED8"}
              barProgressColor={isDarkMode ? "#60A5FA" : "#93C5FD"}
              barProgressSelectedColor={isDarkMode ? "#93C5FD" : "#BFDBFE"}
            />
          </div>
        ) : (
          <div className="p-10 text-center">
            <Calendar className="mx-auto h-10 w-10 text-gray-300 dark:text-neutral-600" />
            <h3 className="mt-2 text-sm font-bold text-gray-800 dark:text-white">
              No Tasks on Project Timeline
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Click below to create your first task for this project schedule.
            </p>
            <button
              className="mt-4 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add New Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;


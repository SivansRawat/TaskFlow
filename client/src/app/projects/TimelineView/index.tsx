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
      <div className="flex h-64 items-center justify-center p-6 text-sm font-semibold text-[#FBBF24]">
        <div className="flex items-center gap-3 font-mono text-sm tracking-wide">
          <Clock className="h-4 w-4 animate-spin text-[#FBBF24]" />
          LOADING TIMELINE SCHEDULE...
        </div>
      </div>
    );
  }

  if (error || !tasks) {
    return (
      <div className="p-6 text-center text-red-400 font-semibold">
        An error occurred while fetching tasks for this timeline.
      </div>
    );
  }

  return (
    <div className="px-4 xl:px-6 py-4 bg-transparent text-white">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div>
          <h1 className="text-lg font-bold text-white uppercase tracking-tight">
            Project Task Schedule
          </h1>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">
            {tasks.length} total tasks scheduled across sprint timeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Pill View Switcher */}
          <div className="flex items-center gap-1 rounded-md bg-[#09090B] p-1 border border-white/10">
            <button
              onClick={() =>
                setDisplayOptions((prev) => ({ ...prev, viewMode: ViewMode.Day }))
              }
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
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
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
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
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                displayOptions.viewMode === ViewMode.Month
                  ? "bg-[#FBBF24] text-black shadow"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={() => setIsModalNewTaskOpen(true)}
            className="flex items-center gap-1.5 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Task
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
              listCellWidth="150px"
              barBackgroundColor="#FBBF24"
              barBackgroundSelectedColor="#FBBF24"
              barProgressColor="#A5FF2A"
              barProgressSelectedColor="#A5FF2A"
            />
          </div>
        ) : (
          <div className="p-10 text-center backdrop-blur-md bg-transparent">
            <Calendar className="mx-auto h-10 w-10 text-white/20" />
            <h3 className="mt-2 text-sm font-bold text-white uppercase tracking-wider">
              No Tasks on Project Timeline
            </h3>
            <p className="mt-1 text-xs text-white/40">
              Click below to create your first task for this project schedule.
            </p>
            <button
              className="mt-4 inline-flex items-center gap-1 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
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


"use client";

import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import { Task, useGetTasksQuery } from "@/state/api";
import React, { useState } from "react";
import { Search, Filter, Plus, CheckSquare, MessageSquare, Clock, LayoutGrid, List as ListIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (isLoading) return <div className="p-6 font-semibold text-slate-500">Loading project task list...</div>;
  if (error) return <div className="p-6 font-semibold text-red-500">An error occurred while fetching tasks</div>;

  const allTasks = tasks || [];
  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.issueKey && task.issueKey.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority =
      selectedPriority === "ALL" || task.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="px-4 pb-8 xl:px-6 bg-transparent text-white">
      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />

      {/* List Toolbar */}
      <div className="mb-6 pt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Filter by title or TF-101..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-white/12 bg-[#18181B] py-2 pl-9 pr-3 text-xs font-semibold text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/40" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-md border border-white/12 bg-[#18181B] p-2 text-xs font-bold text-white focus:border-[#FBBF24] focus:outline-none transition"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">🔥 Urgent</option>
              <option value="High">⚡ High</option>
              <option value="Medium">⭐ Medium</option>
              <option value="Low">🔹 Low</option>
              <option value="Backlog">📦 Backlog</option>
            </select>
          </div>
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-white/12 bg-[#18181B] p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1.5 transition ${
                viewMode === "list"
                  ? "bg-[#FBBF24] text-black shadow"
                  : "text-white/60 hover:text-white"
              }`}
              title="Table List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`rounded-md p-1.5 transition ${
                viewMode === "card"
                  ? "bg-[#FBBF24] text-black shadow"
                  : "text-white/60 hover:text-white"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <button
            className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Render Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-[#18181B]/50 p-12 text-center backdrop-blur-md">
          <p className="text-sm font-bold text-white uppercase tracking-wider">
            No matching tasks found
          </p>
          <p className="mt-1 text-xs text-white/40">
            Try adjusting your search term or filter settings.
          </p>
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task: Task) => {
            const issueKey = task.issueKey || `TF-${task.id + 100}`;
            let subtaskCount = 0;
            let completedSubtasks = 0;
            try {
              if (task.subtasks) {
                const parsed = JSON.parse(task.subtasks);
                if (Array.isArray(parsed)) {
                  subtaskCount = parsed.length;
                  completedSubtasks = parsed.filter((s: any) => s.completed).length;
                }
              }
            } catch (e) {}

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/12 bg-[#18181B]/75 p-4 text-white hover:border-[#FBBF24]/30 hover:scale-[1.005] transition-all duration-200 cursor-pointer"
              >
                {/* Left Section: Key, Title & Description */}
                <div className="flex items-center gap-3 min-w-[280px] flex-1">
                  <span className="rounded-sm bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-2.5 py-0.5 font-mono text-xs font-bold text-[#FBBF24]">
                    {issueKey}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FBBF24] transition">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-white/50 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Priority Badges */}
                <div className="flex items-center gap-3">
                  <span className="rounded-sm border border-white/20 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white/80">
                    {task.status || "To Do"}
                  </span>
                  <span className="rounded-sm border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-bold text-white/70 font-mono uppercase">
                    {task.priority || "Backlog"}
                  </span>
                  {task.points !== undefined && task.points !== null && (
                    <span className="rounded-sm bg-white/10 border border-white/10 px-2 py-0.5 text-[9px] font-bold text-white/80 font-mono">
                      {task.points} pts
                    </span>
                  )}
                </div>

                {/* Right Section: Subtasks & Assignee */}
                <div className="flex items-center gap-4 text-xs text-white/50">
                  {subtaskCount > 0 && (
                    <span className="flex items-center gap-1 font-semibold text-white/60">
                      <CheckSquare className="h-3.5 w-3.5 text-[#FBBF24]" />
                      {completedSubtasks}/{subtaskCount}
                    </span>
                  )}
                  {task.comments && task.comments.length > 0 && (
                    <span className="flex items-center gap-1 font-semibold">
                      <MessageSquare className="h-3.5 w-3.5 text-white/40" />
                      {task.comments.length}
                    </span>
                  )}

                  {task.assignee?.profilePictureUrl ? (
                    <Image
                      src={`/${task.assignee.profilePictureUrl}`}
                      alt={task.assignee.username}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#09090B] border border-white/12 text-[10px] font-bold text-white uppercase font-mono">
                      {task.assignee?.username?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListView;

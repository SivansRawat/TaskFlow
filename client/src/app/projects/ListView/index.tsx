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
    <div className="px-4 pb-8 xl:px-6">
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
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title or TF-101..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:border-blue-500 focus:outline-none transition"
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
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-1.5 transition ${
                viewMode === "list"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
              title="Table List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`rounded-lg p-1.5 transition ${
                viewMode === "card"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <button
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Render Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No matching tasks found
          </p>
          <p className="mt-1 text-xs text-slate-400">
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
                className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all cursor-pointer"
              >
                {/* Left Section: Key, Title & Description */}
                <div className="flex items-center gap-3 min-w-[280px] flex-1">
                  <span className="rounded-md bg-blue-600/10 border border-blue-500/20 px-2.5 py-1 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {issueKey}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Priority Badges */}
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {task.status || "To Do"}
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {task.priority || "Backlog"}
                  </span>
                  {task.points !== undefined && task.points !== null && (
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
                      {task.points} pts
                    </span>
                  )}
                </div>

                {/* Right Section: Subtasks & Assignee */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  {subtaskCount > 0 && (
                    <span className="flex items-center gap-1 font-semibold text-slate-400">
                      <CheckSquare className="h-3.5 w-3.5 text-blue-400" />
                      {completedSubtasks}/{subtaskCount}
                    </span>
                  )}
                  {task.comments && task.comments.length > 0 && (
                    <span className="flex items-center gap-1 font-semibold">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                      {task.comments.length}
                    </span>
                  )}

                  {task.assignee?.profilePictureUrl ? (
                    <Image
                      src={`/${task.assignee.profilePictureUrl}`}
                      alt={task.assignee.username}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase">
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

"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import ModalNewTask from "@/components/ModalNewTask";
import TaskCard from "@/components/TaskCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import {
  Priority,
  Task,
  useGetAuthUserQuery,
  useGetTasksByUserQuery,
  useGetTasksQuery,
} from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import { AlertCircle, ShieldAlert, AlertTriangle, AlertOctagon, Layers3, Grid, List as ListIcon, Plus } from "lucide-react";

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "issueKey",
    headerName: "Key",
    width: 110,
    renderCell: (params) => (
      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
        {params.row.issueKey || `TF-${params.row.id + 100}`}
      </span>
    ),
  },
  {
    field: "title",
    headerName: "Title",
    width: 220,
  },
  {
    field: "description",
    headerName: "Description",
    width: 250,
  },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 120,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.row?.assignee?.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: currentUser } = useGetAuthUserQuery(null);
  const userId = currentUser?.userDetails?.userId ?? null;
  const {
    data: userTasks,
    isLoading: isUserTasksLoading,
  } = useGetTasksByUserQuery(userId || 0, {
    skip: userId === null,
  });

  const { data: allTasks, isLoading: isAllTasksLoading } = useGetTasksQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const availableTasks = (userTasks && userTasks.length > 0) ? userTasks : (allTasks || []);
  const filteredTasks = availableTasks.filter(
    (task: Task) => task.priority === priority,
  );

  const isLoading = isUserTasksLoading || isAllTasksLoading;

  const priorityColors: Record<string, { bg: string; text: string; icon: any }> = {
    Urgent: { bg: "bg-red-500/10 border-red-500/30", text: "text-red-500", icon: AlertCircle },
    High: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-500", icon: ShieldAlert },
    Medium: { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-500", icon: AlertTriangle },
    Low: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-500", icon: AlertOctagon },
    Backlog: { bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-400", icon: Layers3 },
  };

  const currentPriorityConfig = priorityColors[priority] || priorityColors.Backlog;
  const IconComp = currentPriorityConfig.icon;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />

      {/* Priority Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${currentPriorityConfig.bg} ${currentPriorityConfig.text}`}>
            <IconComp className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {priority} Priority Tasks
              </h1>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                {filteredTasks.length} Issues
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Filtered workspace view of all issues flagged with {priority} priority level.
            </p>
          </div>
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => setIsModalNewTaskOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      {/* View Switcher Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              view === "grid"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Grid className="h-3.5 w-3.5" /> Card Grid
          </button>
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              view === "table"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <ListIcon className="h-3.5 w-3.5" /> DataGrid Table
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="p-8 text-center text-sm font-bold text-slate-500">
          Loading {priority} priority tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <IconComp className={`mb-3 h-10 w-10 ${currentPriorityConfig.text}`} />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No {priority} Priority Tasks Found
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            There are currently no tasks flagged with {priority} priority.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <DataGrid
            rows={filteredTasks}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.id}
            onRowClick={(params) => setSelectedTask(params.row)}
            getRowClassName={() => "data-grid-row cursor-pointer"}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      )}
    </div>
  );
};

export default ReusablePriorityPage;

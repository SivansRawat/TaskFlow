"use client";

import {
  Priority,
  Project,
  Task,
  useGetAuthUserQuery,
  useGetProjectsQuery,
  useGetTasksByUserQuery,
  useGetTasksQuery,
  useGetTeamsQuery,
} from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import ModalNewProject from "../projects/ModalNewProject";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import Link from "next/link";
import {
  PlusSquare,
  FolderPlus,
  CheckCircle2,
  Briefcase,
  AlertTriangle,
  Users,
  Search,
  Clock,
  ArrowUpRight,
} from "lucide-react";

import TaskDetailModal from "@/components/TaskDetailModal";

const taskColumns: GridColDef[] = [
  {
    field: "issueKey",
    headerName: "Key",
    width: 110,
    renderCell: (params) => (
      <span className="font-mono text-xs font-bold text-[#FBBF24] bg-[#FBBF24]/10 px-2 py-0.5 rounded border border-[#FBBF24]/20">
        {params.row.issueKey || `TF-${params.row.id + 100}`}
      </span>
    ),
  },
  { field: "title", headerName: "Task Title", width: 230 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => (
      <span className="rounded-sm border border-white/20 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white/80">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 130,
    renderCell: (params) => {
      const p = params.value;
      const color =
        p === "Urgent"
          ? "border-red-500/30 bg-red-500/10 text-red-400"
          : p === "High"
          ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
          : "border-white/10 bg-white/5 text-white/60";
      return (
        <span className={`rounded-sm border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
          {p}
        </span>
      );
    },
  },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

const COLORS = ["#FBBF24", "#F59E0B", "#A5FF2A", "#FFFFFF"];

const HomePage = () => {
  const { data: currentUser } = useGetAuthUserQuery(null);
  const { data: teams } = useGetTeamsQuery();
  const userId = currentUser?.userDetails?.userId;
  const user = currentUser?.userDetails;

  const {
    data: userTasks,
    isLoading: tasksLoading,
  } = useGetTasksByUserQuery(userId || 0, {
    skip: !userId,
  });

  const { data: allWorkspaceTasks } = useGetTasksQuery();
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (tasksLoading || isProjectsLoading) {
    return <div className="p-8 font-semibold text-[#FBBF24]">LOADING WORKSPACE DASHBOARD...</div>;
  }

  const tasks = userTasks || [];
  const allProjects = projects || [];
  const userTeam = teams?.find((t) => t.teamId === user?.teamId || (t as any).id === user?.teamId);

  // Use user tasks if available; otherwise fall back to all workspace tasks so analytics charts are rich and complete
  const analyticsTasks = tasks.length > 0 ? tasks : (allWorkspaceTasks || []);

  const completedTasksCount = (analyticsTasks.length > 0 ? analyticsTasks : tasks).filter(
    (t) => t.status === "Completed",
  ).length;

  const urgentTasksCount = (analyticsTasks.length > 0 ? analyticsTasks : tasks).filter(
    (t) => t.priority === Priority.Urgent || t.priority === Priority.High,
  ).length;

  const priorityOrder = ["Urgent", "High", "Medium", "Low", "Backlog"];

  const priorityCount = analyticsTasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      if (priority) {
        acc[priority] = (acc[priority] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  const taskDistribution = priorityOrder
    .map((key) => ({
      name: key,
      count: priorityCount[key] || 0,
    }))
    .filter((item) => item.count > 0 || analyticsTasks.length > 0);

  const statusCount = allProjects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const now = new Date();
      const isPast = project.endDate ? new Date(project.endDate) < now : false;
      const projectTasks = tasks.filter((t) => t.projectId === project.id);
      const isCompleted =
        (project as any).status === "Completed" ||
        (isPast && projectTasks.length > 0 && projectTasks.every((t) => t.status === "Completed"));

      const status = isCompleted ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { Active: 0, Completed: 0 },
  );

  const projectStatus = Object.keys(statusCount)
    .filter((key) => statusCount[key] > 0)
    .map((key) => ({
      name: key,
      count: statusCount[key],
    }));

  const chartColors = {
    bar: "#FBBF24", // Primary #FBBF24
    barGrid: "rgba(255, 255, 255, 0.06)",
    pieFill: "#FBBF24",
    text: "rgba(255, 255, 255, 0.6)",
  };

  const hasData = tasks.length > 0 || allProjects.length > 0;

  return (
    <div className="container h-full w-[100%] bg-transparent p-8">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      {/* Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Header name={`Welcome, ${user?.username || "User"}! 👋`} />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
          >
            <PlusSquare className="h-4 w-4" /> Create Project
          </button>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-lg bg-[#18181B]/75 border border-white/12 p-5 backdrop-blur-md text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono">
              Assigned Tasks
            </span>
            <div className="rounded-md bg-[#FBBF24]/10 p-2 text-[#FBBF24] border border-[#FBBF24]/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">{tasks.length}</span>
            <span className="text-xs text-white/50">
              ({completedTasksCount} completed)
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg bg-[#18181B]/75 border border-white/12 p-5 backdrop-blur-md text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono">
              Active Projects
            </span>
            <div className="rounded-md bg-[#A5FF2A]/10 p-2 text-[#A5FF2A] border border-[#A5FF2A]/20">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">{allProjects.length}</span>
            <span className="text-xs text-[#A5FF2A]/80 font-bold uppercase font-mono tracking-wider">
              Workspaces
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-lg bg-[#18181B]/75 border border-white/12 p-5 backdrop-blur-md text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono">
              Priority Alerts
            </span>
            <div className="rounded-md bg-[#F59E0B]/10 p-2 text-[#F59E0B] border border-[#F59E0B]/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">{urgentTasksCount}</span>
            <span className="text-xs text-[#F59E0B]/80 font-bold uppercase font-mono tracking-wider">
              Urgent / High
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-lg bg-[#18181B]/75 border border-white/12 p-5 backdrop-blur-md text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono">
              Team Membership
            </span>
            <div className="rounded-md bg-white/5 p-2 text-white/70 border border-white/10">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="truncate text-sm font-bold text-white uppercase font-mono">
              {userTeam ? userTeam.teamName : "No Team Joined"}
            </div>
            <Link href="/teams" className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#FBBF24] hover:underline uppercase tracking-wide font-mono">
              Manage Teams <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="mt-6 rounded-lg bg-[#18181B]/75 border border-white/12 p-10 text-center backdrop-blur-md text-white shadow-lg">
          <h2 className="text-xl font-bold uppercase tracking-wide">Workspace is Ready 🚀</h2>
          <p className="mt-2 text-xs text-white/50">
            Create your first project or join a team to start tracking your workflow and tasks.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setIsModalNewProjectOpen(true)}
              className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#F59E0B] transition shadow"
            >
              <PlusSquare className="h-4 w-4" /> Create Your First Project
            </button>
            <Link
              href="/teams"
              className="flex items-center gap-2 rounded-md border border-white/15 bg-[#18181B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#27272A] transition"
            >
              <Users className="h-4 w-4" /> Explore & Join Teams
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Chart 1 */}
          <div className="rounded-lg bg-[#18181B]/75 border border-white/12 p-5 backdrop-blur-md shadow-lg">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/50 font-mono">
              Task Priority Analytics
            </h3>
            {taskDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={taskDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.barGrid}
                  />
                  <XAxis dataKey="name" stroke={chartColors.text} tick={{ fontSize: 10 }} />
                  <YAxis stroke={chartColors.text} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backgroundColor: "rgba(24,24,27,0.9)",
                    }}
                  />
                  <Bar dataKey="count" fill={chartColors.bar} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-white/40">No priority data available.</p>
            )}
          </div>

          {/* Chart 2 */}
          <div className="rounded-lg bg-[#18181B]/75 border border-white/12 p-5 backdrop-blur-md shadow-lg">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/50 font-mono">
              Project Status Distribution
            </h3>
            {projectStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label={{ fill: "#fff", fontSize: 10 }}>
                    {projectStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backgroundColor: "rgba(24,24,27,0.9)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-white/40">No project status data available.</p>
            )}
          </div>

          {/* Tasks Table */}
          {(() => {
            const gridTasks = tasks.length > 0 ? tasks : (allWorkspaceTasks || []);
            return (
              <div className="rounded-lg bg-[#18181B]/75 border border-white/12 p-5 backdrop-blur-md md:col-span-2 shadow-lg">
                <TaskDetailModal
                  task={selectedTask}
                  isOpen={Boolean(selectedTask)}
                  onClose={() => setSelectedTask(null)}
                />
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 font-mono">
                    Your Assigned Tasks ({gridTasks.length})
                  </h3>
                  <Link href="/timeline" className="text-xs font-bold text-[#FBBF24] hover:underline uppercase tracking-wide font-mono">
                    View Timeline View →
                  </Link>
                </div>
                <div style={{ height: 350, width: "100%" }}>
                  <DataGrid
                    rows={gridTasks}
                    columns={taskColumns}
                    checkboxSelection
                    loading={tasksLoading}
                    onRowClick={(params) => setSelectedTask(params.row)}
                    getRowClassName={() => "data-grid-row cursor-pointer"}
                    getCellClassName={() => "data-grid-cell"}
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(true)} // Force Dark Mode settings for grid cells
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default HomePage;

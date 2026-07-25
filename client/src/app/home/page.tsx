"use client";

import {
  Priority,
  Project,
  Task,
  useGetAuthUserQuery,
  useGetProjectsQuery,
  useGetTasksByUserQuery,
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

const taskColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "title", headerName: "Task Title", width: 220 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => (
      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
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
          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
          : p === "High"
          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
          : "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300";
      return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>
          {p}
        </span>
      );
    },
  },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];

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

  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  if (tasksLoading || isProjectsLoading) {
    return <div className="p-8 font-semibold dark:text-white">Loading Workspace Dashboard...</div>;
  }

  const tasks = userTasks || [];
  const allProjects = projects || [];
  const userTeam = teams?.find((t) => t.teamId === user?.teamId || (t as any).id === user?.teamId);

  const completedTasksCount = tasks.filter((t) => t.status === "Completed").length;
  const urgentTasksCount = tasks.filter(
    (t) => t.priority === Priority.Urgent || t.priority === Priority.High,
  ).length;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

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

  const chartColors = isDarkMode
    ? {
        bar: "#60A5FA",
        barGrid: "#262626",
        pieFill: "#3B82F6",
        text: "#F3F4F6",
      }
    : {
        bar: "#2563EB",
        barGrid: "#E5E7EB",
        pieFill: "#3B82F6",
        text: "#1F2937",
      };

  const hasData = tasks.length > 0 || allProjects.length > 0;

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
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
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-blue-700 transition"
          >
            <PlusSquare className="h-4 w-4" /> Create Project
          </button>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-xl bg-white p-5 shadow dark:bg-dark-secondary dark:text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Assigned Tasks
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-neutral-800 dark:text-blue-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{tasks.length}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({completedTasksCount} completed)
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl bg-white p-5 shadow dark:bg-dark-secondary dark:text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Active Projects
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-neutral-800 dark:text-purple-400">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{allProjects.length}</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
              Live Workspaces
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl bg-white p-5 shadow dark:bg-dark-secondary dark:text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Priority Alerts
            </span>
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600 dark:bg-neutral-800 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{urgentTasksCount}</span>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
              High / Urgent
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl bg-white p-5 shadow dark:bg-dark-secondary dark:text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Team Membership
            </span>
            <div className="rounded-lg bg-green-50 p-2 text-green-600 dark:bg-neutral-800 dark:text-green-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="truncate text-base font-bold text-gray-800 dark:text-white">
              {userTeam ? userTeam.teamName : "No Team Joined"}
            </div>
            <Link href="/teams" className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Manage Teams <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="mt-6 rounded-xl bg-white p-10 text-center shadow dark:bg-dark-secondary dark:text-white">
          <h2 className="text-2xl font-bold">Your Workspace is Ready 🚀</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create your first project or join a team to start tracking your workflow and tasks.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setIsModalNewProjectOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow"
            >
              <PlusSquare className="h-5 w-5" /> Create Your First Project
            </button>
            <Link
              href="/teams"
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200"
            >
              <Users className="h-5 w-5" /> Explore & Join Teams
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Chart 1 */}
          <div className="rounded-xl bg-white p-5 shadow dark:bg-dark-secondary">
            <h3 className="mb-4 text-base font-bold dark:text-white">
              Task Priority Analytics
            </h3>
            {taskDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={taskDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.barGrid}
                  />
                  <XAxis dataKey="name" stroke={chartColors.text} />
                  <YAxis stroke={chartColors.text} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="count" fill={chartColors.bar} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">No priority data available.</p>
            )}
          </div>

          {/* Chart 2 */}
          <div className="rounded-xl bg-white p-5 shadow dark:bg-dark-secondary">
            <h3 className="mb-4 text-base font-bold dark:text-white">
              Project Status Distribution
            </h3>
            {projectStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                    {projectStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">No project status data available.</p>
            )}
          </div>

          {/* Tasks Table */}
          <div className="rounded-xl bg-white p-5 shadow dark:bg-dark-secondary md:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold dark:text-white">
                Your Assigned Tasks ({tasks.length})
              </h3>
              <Link href="/timeline" className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">
                View Timeline View →
              </Link>
            </div>
            <div style={{ height: 350, width: "100%" }}>
              <DataGrid
                rows={tasks}
                columns={taskColumns}
                checkboxSelection
                loading={tasksLoading}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-cell"}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

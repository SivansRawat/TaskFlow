import { useGetTasksQuery, useUpdateTaskStatusMutation, useGetUsersQuery } from "@/state/api";
import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType, Status, Priority } from "@/state/api";
import { EllipsisVertical, MessageSquare, Plus, Search, Filter, CheckSquare, Clock, Paperclip } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import TaskDetailModal from "@/components/TaskDetailModal";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div className="p-6 font-semibold dark:text-white">Loading Project Board...</div>;
  if (error) return <div className="p-6 font-semibold text-red-500">Error retrieving project tasks</div>;

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

  const handleOpenDetail = (task: TaskType) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Jira Board Filter & Action Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-4 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks or TF-101 key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:border-blue-500 focus:outline-none transition"
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

        {/* Create Task Button */}
        <button
          onClick={() => setIsModalNewTaskOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" /> Create Issue
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={filteredTasks}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            onOpenDetail={handleOpenDetail}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  onOpenDetail: (task: TaskType) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
  onOpenDetail,
}: TaskColumnProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => {
      moveTask(item.id, status);
    },
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const columnTasks = tasks.filter((task) => task.status === status);

  const statusColor: Record<string, string> = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#4B5563",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-2xl p-3 bg-slate-100/80 dark:bg-slate-950/80 border transition-all duration-200 ${
        isOver
          ? "bg-blue-500/15 border-blue-500/80 ring-2 ring-blue-500/40 shadow-lg scale-[1.01]"
          : canDrop
          ? "border-blue-400/40 bg-slate-100/90 dark:bg-slate-900/40"
          : "border-slate-200/70 dark:border-slate-800/80"
      }`}
    >
      <div className="mb-3 flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: statusColor[status] }}
          />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
            {status}
          </h3>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-extrabold text-slate-600 dark:text-slate-300">
            {columnTasks.length}
          </span>
        </div>
        <button
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
          onClick={() => setIsModalNewTaskOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {columnTasks.map((task) => (
          <TaskItem key={task.id} task={task} onOpenDetail={onOpenDetail} onMoveTask={moveTask} />
        ))}
      </div>
    </div>
  );
};

type TaskItemProps = {
  task: TaskType;
  onOpenDetail: (task: TaskType) => void;
  onMoveTask: (taskId: number, status: string) => void;
};

const TaskItem = ({ task, onOpenDetail, onMoveTask }: TaskItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

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
      ref={(instance) => {
        drag(instance);
      }}
      onClick={() => onOpenDetail(task)}
      className={`group cursor-grab active:cursor-grabbing rounded-xl bg-white p-4 shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:shadow-md hover:border-blue-500/60 transition-all duration-150 ${
        isDragging ? "opacity-30 scale-95" : "opacity-100 hover:-translate-y-0.5"
      }`}
    >
      {/* Key & Priority Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md bg-blue-600/10 border border-blue-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
          {issueKey}
        </span>
        <div className="flex items-center gap-1.5">
          {task.priority && (
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              {task.priority}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="mb-1 text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition line-clamp-2">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Card Footer Info */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
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
          {task.points !== undefined && task.points !== null && (
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
              {task.points} pts
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
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
};

export default BoardView;

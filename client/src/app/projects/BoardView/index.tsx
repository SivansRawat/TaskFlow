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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-4 pt-2 text-white">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search tasks or TF-101 key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-white/12 bg-[#18181B] py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
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

        {/* Create Task Button */}
        <button
          onClick={() => setIsModalNewTaskOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors animate-pulse-subtle"
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
    "To Do": "#FBBF24",
    "Work In Progress": "#3B82F6",
    "Under Review": "#F59E0B",
    Completed: "#A5FF2A",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-lg p-3 bg-[#18181B]/50 border transition-all duration-200 ${
        isOver
          ? "bg-[#FBBF24]/5 border-[#FBBF24]/50 ring-2 ring-[#FBBF24]/20 shadow-lg scale-[1.01]"
          : canDrop
          ? "border-[#FBBF24]/20 bg-[#18181B]/75"
          : "border-white/12"
      }`}
    >
      <div className="mb-3 flex w-full items-center justify-between rounded-md bg-[#18181B] px-4 py-3 border border-white/12">
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: statusColor[status] }}
          />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {status}
          </h3>
          <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-extrabold text-white/70 font-mono">
            {columnTasks.length}
          </span>
        </div>
        <button
          className="rounded-md p-1 text-white/40 hover:bg-white/5 hover:text-white transition"
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
      className={`group cursor-grab active:cursor-grabbing rounded-lg bg-[#18181B] p-4 border border-white/12 text-white hover:border-[#FBBF24]/30 hover:scale-[1.01] transition-all duration-150 ${
        isDragging ? "opacity-30 scale-95" : "opacity-100 hover:-translate-y-0.5"
      }`}
    >
      {/* Key & Priority Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-sm bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FBBF24]">
          {issueKey}
        </span>
        <div className="flex items-center gap-1.5">
          {task.priority && (
            <span className="rounded-sm bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70 font-mono uppercase">
              {task.priority}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="mb-1 text-sm font-bold text-white group-hover:text-[#FBBF24] transition line-clamp-2">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="mb-3 text-xs text-white/50 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Card Footer Info */}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px] text-white/50">
        <div className="flex items-center gap-3">
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
          {task.points !== undefined && task.points !== null && (
            <span className="rounded-sm bg-white/10 border border-white/10 px-2 py-0.5 text-[9px] font-bold text-white/80 font-mono">
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
};

export default BoardView;

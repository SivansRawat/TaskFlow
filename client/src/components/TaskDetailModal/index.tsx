"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Task,
  Status,
  Priority,
  useUpdateTaskDetailsMutation,
  useGetUsersQuery,
  useGetAuthUserQuery,
} from "@/state/api";
import {
  X,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  User as UserIcon,
  Tag,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  MessageSquare,
} from "lucide-react";

type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
};

const TaskDetailModal = ({ task, isOpen, onClose }: Props) => {
  const [updateTaskDetails, { isLoading: isUpdating }] = useUpdateTaskDetailsMutation();
  const { data: users } = useGetUsersQuery();
  const { data: currentUser } = useGetAuthUserQuery(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [points, setPoints] = useState<number | "">(0);
  const [assignedUserId, setAssignedUserId] = useState<number | "">("");
  const [tags, setTags] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus((task.status as Status) || Status.ToDo);
      setPriority((task.priority as Priority) || Priority.Backlog);
      setPoints(task.points ?? 0);
      setAssignedUserId(task.assignedUserId ?? "");
      setTags(task.tags || "");

      try {
        if (task.subtasks) {
          const parsed = JSON.parse(task.subtasks);
          if (Array.isArray(parsed)) {
            setSubtasks(parsed);
          } else {
            setSubtasks([]);
          }
        } else {
          setSubtasks([]);
        }
      } catch (err) {
        setSubtasks([]);
      }
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const issueKey = task.issueKey || `TF-${task.id + 100}`;

  const handleSaveField = async (updatedFields: Partial<Task>) => {
    try {
      await updateTaskDetails({
        taskId: task.id,
        userId: currentUser?.userDetails?.userId,
        ...updatedFields,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update task detail:", err);
    }
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    const updated = subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setSubtasks(updated);
    handleSaveField({ subtasks: JSON.stringify(updated) });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    const updated = [...subtasks, newSt];
    setSubtasks(updated);
    setNewSubtaskTitle("");
    handleSaveField({ subtasks: JSON.stringify(updated) });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updated = subtasks.filter((st) => st.id !== subtaskId);
    setSubtasks(updated);
    handleSaveField({ subtasks: JSON.stringify(updated) });
  };

  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;
  const subtaskProgressPercent =
    subtasks.length > 0 ? Math.round((completedSubtasksCount / subtasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-[#18181B] border-l border-white/12 p-6 text-white shadow-2xl overflow-y-auto">
        {/* Header Bar */}
        <div className="mb-6 flex items-center justify-between border-b border-white/12 pb-4">
          <div className="flex items-center gap-3">
            <span className="rounded-sm bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-3 py-0.5 font-mono text-xs font-bold text-[#FBBF24]">
              {issueKey}
            </span>
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">
              Project #{task.projectId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSaveField({ title })}
            className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-base font-bold text-white focus:border-[#FBBF24] focus:outline-none transition"
          />
        </div>

        {/* Status & Priority Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-md border border-white/10 bg-[#09090B] p-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                const val = e.target.value as Status;
                setStatus(val);
                handleSaveField({ status: val });
              }}
              className="w-full rounded-md border border-white/12 bg-[#18181B] p-2 text-xs font-bold text-white focus:border-[#FBBF24] focus:outline-none"
            >
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => {
                const val = e.target.value as Priority;
                setPriority(val);
                handleSaveField({ priority: val });
              }}
              className="w-full rounded-md border border-white/12 bg-[#18181B] p-2 text-xs font-bold text-white focus:border-[#FBBF24] focus:outline-none"
            >
              <option value={Priority.Urgent}>Urgent</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Backlog}>Backlog</option>
            </select>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleSaveField({ description })}
            placeholder="Add detailed task notes, acceptance criteria or instructions..."
            className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-xs font-semibold text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
          />
        </div>

        {/* Assignee & Story Points Bar */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
              Assignee
            </label>
            <select
              value={assignedUserId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : "";
                setAssignedUserId(val);
                handleSaveField({ assignedUserId: val ? Number(val) : undefined });
              }}
              className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-xs font-semibold text-white focus:border-[#FBBF24] focus:outline-none"
            >
              <option value="">Unassigned</option>
              {users?.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
              Story Points
            </label>
            <input
              type="number"
              min={0}
              value={points}
              onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
              onBlur={() => handleSaveField({ points: points === "" ? undefined : Number(points) })}
              className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-xs font-semibold text-white focus:border-[#FBBF24] focus:outline-none"
            />
          </div>
        </div>

        {/* Subtask Checklist Section */}
        <div className="mb-6 rounded-md border border-white/12 bg-[#09090B] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/80 font-mono flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#FBBF24]" /> Subtask Checklist ({completedSubtasksCount}/{subtasks.length})
            </h4>
            <span className="text-xs font-bold text-[#FBBF24] font-mono">{subtaskProgressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[#18181B] border border-white/5">
            <div
              className="h-full bg-[#FBBF24] transition-all duration-300"
              style={{ width: `${subtaskProgressPercent}%` }}
            />
          </div>

          {/* List of Subtasks */}
          <div className="space-y-2 mb-3">
            {subtasks.map((st) => (
              <div
                key={st.id}
                className="flex items-center justify-between rounded-md bg-[#18181B]/50 p-2.5 border border-white/10 text-xs hover:border-white/20 transition"
              >
                <button
                  type="button"
                  onClick={() => handleSubtaskToggle(st.id)}
                  className="flex items-center gap-2.5 text-left text-white"
                >
                  {st.completed ? (
                    <CheckSquare className="h-4 w-4 text-[#FBBF24]" />
                  ) : (
                    <Square className="h-4 w-4 text-white/30" />
                  )}
                  <span className={st.completed ? "line-through text-white/40" : "font-semibold"}>
                    {st.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSubtask(st.id)}
                  className="text-white/40 hover:text-red-400 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new subtask item..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              className="flex-1 rounded-md border border-white/12 bg-[#18181B] p-2 text-xs text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-auto border-t border-white/10 pt-4">
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#FBBF24]" /> Activity & Comments ({task.comments?.length || 0})
          </h4>
          {task.comments && task.comments.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {task.comments.map((c) => (
                <div key={c.id} className="rounded-md bg-[#09090B] p-2.5 border border-white/10 text-xs">
                  <div className="font-bold text-[#FBBF24] font-mono text-[10px] uppercase tracking-wider mb-0.5">
                    {c.user?.username || `User #${c.userId}`}
                  </div>
                  <div className="text-white/80">{c.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30">No comments posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

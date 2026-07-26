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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-slate-900 border-l border-slate-800 p-6 text-slate-100 shadow-2xl overflow-y-auto">
        {/* Header Bar */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-blue-600/20 border border-blue-500/30 px-3 py-1 font-mono text-xs font-bold text-blue-400">
              {issueKey}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project #{task.projectId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSaveField({ title })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-lg font-bold text-white focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Status & Priority Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                const val = e.target.value as Status;
                setStatus(val);
                handleSaveField({ status: val });
              }}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => {
                const val = e.target.value as Priority;
                setPriority(val);
                handleSaveField({ priority: val });
              }}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={Priority.Urgent}>🔥 Urgent</option>
              <option value={Priority.High}>⚡ High</option>
              <option value={Priority.Medium}>⭐ Medium</option>
              <option value={Priority.Low}>🔹 Low</option>
              <option value={Priority.Backlog}>📦 Backlog</option>
            </select>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleSaveField({ description })}
            placeholder="Add detailed task notes, acceptance criteria or instructions..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Assignee & Points Bar */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Assignee
            </label>
            <select
              value={assignedUserId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : "";
                setAssignedUserId(val);
                handleSaveField({ assignedUserId: val ? Number(val) : undefined });
              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
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
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Story Points
            </label>
            <input
              type="number"
              min={0}
              value={points}
              onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
              onBlur={() => handleSaveField({ points: points === "" ? undefined : Number(points) })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Subtask Checklist Section */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-blue-400" /> Subtask Checklist ({completedSubtasksCount}/{subtasks.length})
            </h4>
            <span className="text-xs font-bold text-blue-400">{subtaskProgressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300"
              style={{ width: `${subtaskProgressPercent}%` }}
            />
          </div>

          {/* List of Subtasks */}
          <div className="space-y-2 mb-3">
            {subtasks.map((st) => (
              <div
                key={st.id}
                className="flex items-center justify-between rounded-lg bg-slate-900/80 p-2.5 border border-slate-800/60 text-xs hover:border-slate-700 transition"
              >
                <button
                  type="button"
                  onClick={() => handleSubtaskToggle(st.id)}
                  className="flex items-center gap-2.5 text-left text-slate-200"
                >
                  {st.completed ? (
                    <CheckSquare className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-500" />
                  )}
                  <span className={st.completed ? "line-through text-slate-500" : "font-medium"}>
                    {st.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSubtask(st.id)}
                  className="text-slate-500 hover:text-red-400 transition"
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
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500 transition flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-auto border-t border-slate-800 pt-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-400" /> Activity & Comments ({task.comments?.length || 0})
          </h4>
          {task.comments && task.comments.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {task.comments.map((c) => (
                <div key={c.id} className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/50 text-xs">
                  <div className="font-bold text-blue-400 mb-0.5">
                    {c.user?.username || `User #${c.userId}`}
                  </div>
                  <div className="text-slate-300">{c.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No comments posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

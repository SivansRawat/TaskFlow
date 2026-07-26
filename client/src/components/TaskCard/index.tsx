import { Task, useDeleteTaskMutation } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";
import { Trash2, CheckSquare, MessageSquare, Paperclip, Clock } from "lucide-react";
import TaskDetailModal from "@/components/TaskDetailModal";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const [deleteTask] = useDeleteTaskMutation();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  };

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
    <>
      <TaskDetailModal
        task={task}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <div
        onClick={() => setIsDetailOpen(true)}
        className="group relative mb-3 cursor-pointer rounded-xl bg-white p-4 shadow-sm border border-gray-200 dark:border-neutral-800 dark:bg-slate-900/90 dark:text-white hover:shadow-md hover:border-blue-500/50 transition duration-200"
      >
        <button
          onClick={handleDelete}
          className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-neutral-800 transition"
          title="Delete Task"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Issue Key & Priority Header */}
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-md bg-blue-600/10 border border-blue-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
            {issueKey}
          </span>
          {task.priority && (
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {task.priority}
            </span>
          )}
          {task.points !== undefined && task.points !== null && (
            <span className="ml-auto rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
              {task.points} pts
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="mb-1 text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition line-clamp-1">
          {task.title}
        </h4>

        {/* Description snippet */}
        {task.description && (
          <p className="mb-3 text-xs text-gray-500 dark:text-slate-400 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Attachment preview */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-800">
            <Image
              src={`/${task.attachments[0].fileURL}`}
              alt={task.attachments[0].fileName || "Attachment"}
              width={400}
              height={180}
              className="h-28 w-full object-cover"
            />
          </div>
        )}

        {/* Footer info: Subtasks, Assignee, Date */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 dark:border-slate-800/80 text-[11px] text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            {subtaskCount > 0 && (
              <span className="flex items-center gap-1 font-semibold text-slate-400">
                <CheckSquare className="h-3.5 w-3.5 text-blue-400" />
                {completedSubtasks}/{subtaskCount}
              </span>
            )}
            {task.comments && task.comments.length > 0 && (
              <span className="flex items-center gap-1 font-semibold text-slate-400">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                {task.comments.length}
              </span>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <span className="flex items-center gap-1 font-semibold text-slate-400">
                <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                {task.attachments.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.dueDate && (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3 text-slate-400" />
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            )}
            {task.assignee?.profilePictureUrl ? (
              <Image
                src={`/${task.assignee.profilePictureUrl}`}
                alt={task.assignee.username}
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white uppercase">
                {task.assignee?.username?.charAt(0) || "U"}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;

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
        className="group relative mb-3 cursor-pointer rounded-lg bg-[#18181B]/75 p-4 border border-white/12 text-white hover:border-[#FBBF24]/30 hover:scale-[1.01] transition duration-200"
      >
        <button
          onClick={handleDelete}
          className="absolute right-3 top-3 rounded-md p-1.5 text-white/50 opacity-0 group-hover:opacity-100 hover:bg-red-950/40 hover:text-red-400 transition"
          title="Delete Task"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Issue Key & Priority Header */}
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-sm bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FBBF24]">
            {issueKey}
          </span>
          {task.priority && (
            <span className="rounded-sm bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70 font-mono uppercase">
              {task.priority}
            </span>
          )}
          {task.points !== undefined && task.points !== null && (
            <span className="ml-auto rounded-sm bg-white/10 border border-white/10 px-2 py-0.5 text-[9px] font-bold text-white/80 font-mono">
              {task.points} pts
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="mb-1 text-sm font-bold text-white group-hover:text-[#FBBF24] transition line-clamp-1">
          {task.title}
        </h4>

        {/* Description snippet */}
        {task.description && (
          <p className="mb-3 text-xs text-white/50 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Attachment preview */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="mb-3 overflow-hidden rounded-md border border-white/12">
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
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px] text-white/50">
          <div className="flex items-center gap-3">
            {subtaskCount > 0 && (
              <span className="flex items-center gap-1 font-semibold text-white/60">
                <CheckSquare className="h-3.5 w-3.5 text-[#FBBF24]" />
                {completedSubtasks}/{subtaskCount}
              </span>
            )}
            {task.comments && task.comments.length > 0 && (
              <span className="flex items-center gap-1 font-semibold text-white/60">
                <MessageSquare className="h-3.5 w-3.5 text-white/40" />
                {task.comments.length}
              </span>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <span className="flex items-center gap-1 font-semibold text-white/60">
                <Paperclip className="h-3.5 w-3.5 text-white/40" />
                {task.attachments.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.dueDate && (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3 text-white/40" />
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            )}
            {task.assignee?.profilePictureUrl ? (
              <Image
                src={`/${task.assignee.profilePictureUrl}`}
                alt={task.assignee.username}
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-cover border border-white/10"
              />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#09090B] border border-white/12 text-[9px] font-bold text-white uppercase">
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

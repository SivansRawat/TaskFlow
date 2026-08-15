import { Project, useDeleteProjectMutation } from "@/state/api";
import React from "react";
import { Trash2 } from "lucide-react";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const [deleteProject] = useDeleteProjectMutation();

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      await deleteProject(project.id);
    }
  };

  return (
    <div className="relative rounded-lg bg-[#18181B]/75 p-4 border border-white/12 text-white hover:border-[#FBBF24]/30 hover:scale-[1.01] transition duration-200">
      <button
        onClick={handleDelete}
        className="absolute right-4 top-4 rounded-md p-1.5 text-white/50 hover:bg-red-950/40 hover:text-red-400 transition"
        title="Delete Project"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <h3 className="text-base font-bold text-white uppercase tracking-tight">{project.name}</h3>
      <p className="text-xs text-white/50 mt-1 mb-3">{project.description || "No description provided."}</p>
      <div className="flex gap-4 text-[10px] text-white/40 font-mono">
        <div>START: {project.startDate ? project.startDate.split("T")[0] : "N/A"}</div>
        <div>END: {project.endDate ? project.endDate.split("T")[0] : "N/A"}</div>
      </div>
    </div>
  );
};

export default ProjectCard;

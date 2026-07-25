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
    <div className="relative rounded border p-4 shadow dark:bg-dark-secondary dark:text-white">
      <button
        onClick={handleDelete}
        className="absolute right-4 top-4 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-neutral-800"
        title="Delete Project"
      >
        <Trash2 className="h-5 w-5" />
      </button>
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
      <p className="mt-2 text-xs text-gray-500">Start Date: {project.startDate ? project.startDate.split("T")[0] : "N/A"}</p>
      <p className="text-xs text-gray-500">End Date: {project.endDate ? project.endDate.split("T")[0] : "N/A"}</p>
    </div>
  );
};

export default ProjectCard;

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { organizationId } = req.query;
  try {
    const orgId = organizationId ? Number(organizationId) : 1;
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { organizationId: orgId },
          { organizationId: null },
        ],
      },
    });
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    res.status(400).json({ message: "Project name is required" });
    return;
  }
  try {
    const newProject = await prisma.project.create({
      data: {
        name: name.trim(),
        description,
        startDate,
        endDate,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating project: ${error.message}` });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const projectId = Number(id);
  if (isNaN(projectId)) {
    res.status(400).json({ message: "Invalid project ID parameter" });
    return;
  }
  try {
    // Delete associated tasks, assignments, projectTeams first
    await prisma.taskAssignment.deleteMany({ where: { task: { projectId } } });
    await prisma.attachment.deleteMany({ where: { task: { projectId } } });
    await prisma.comment.deleteMany({ where: { task: { projectId } } });
    await prisma.task.deleteMany({ where: { projectId } });
    await prisma.projectTeam.deleteMany({ where: { projectId } });
    await prisma.project.delete({ where: { id: projectId } });
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting project: ${error.message}` });
  }
};


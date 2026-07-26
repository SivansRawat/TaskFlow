import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: projectId ? { projectId: Number(projectId) } : {},
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
    issueKey,
    subtasks,
  } = req.body;
  try {
    const totalCount = await prisma.task.count();
    const generatedKey = issueKey || `TF-${101 + totalCount}`;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "To Do",
        priority: priority || "Backlog",
        tags,
        startDate,
        dueDate,
        points: points ? Number(points) : null,
        projectId: Number(projectId),
        authorUserId: Number(authorUserId),
        assignedUserId: assignedUserId ? Number(assignedUserId) : null,
        issueKey: generatedKey,
        subtasks,
      },
      include: {
        author: true,
        assignee: true,
      },
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        taskId: newTask.id,
        userId: Number(authorUserId),
        action: `created task ${generatedKey}`,
      },
    });

    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status, userId } = req.body;
  try {
    const id = Number(taskId);
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
      include: { author: true, assignee: true },
    });

    await prisma.activity.create({
      data: {
        taskId: id,
        userId: userId ? Number(userId) : null,
        action: `updated status to ${status}`,
      },
    });

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    assignedUserId,
    subtasks,
    userId,
  } = req.body;
  try {
    const id = Number(taskId);
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(tags !== undefined && { tags }),
        ...(startDate !== undefined && { startDate }),
        ...(dueDate !== undefined && { dueDate }),
        ...(points !== undefined && { points: points ? Number(points) : null }),
        ...(assignedUserId !== undefined && {
          assignedUserId: assignedUserId ? Number(assignedUserId) : null,
        }),
        ...(subtasks !== undefined && { subtasks }),
      },
      include: {
        author: true,
        assignee: true,
        comments: { include: { user: true } },
        attachments: true,
      },
    });

    await prisma.activity.create({
      data: {
        taskId: id,
        userId: userId ? Number(userId) : null,
        action: `updated task details`,
      },
    });

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task details: ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
          { taskAssignments: { some: { userId: Number(userId) } } },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user's tasks: ${error.message}` });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  try {
    const id = Number(taskId);
    await prisma.taskAssignment.deleteMany({ where: { taskId: id } });
    await prisma.attachment.deleteMany({ where: { taskId: id } });
    await prisma.comment.deleteMany({ where: { taskId: id } });
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting task: ${error.message}` });
  }
};

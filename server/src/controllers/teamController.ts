import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  const { organizationId } = req.query;
  try {
    const orgId = organizationId ? Number(organizationId) : 1;
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { organizationId: orgId },
          { organizationId: null },
        ],
      },
    });

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        const productOwner = team.productOwnerUserId
          ? await prisma.user.findUnique({
              where: { userId: team.productOwnerUserId },
              select: { username: true },
            })
          : null;

        const projectManager = team.projectManagerUserId
          ? await prisma.user.findUnique({
              where: { userId: team.projectManagerUserId },
              select: { username: true },
            })
          : null;

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamName, productOwnerUserId, projectManagerUserId } = req.body;

    if (!teamName) {
      res.status(400).json({ message: "Team name is required" });
      return;
    }

    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : null,
        projectManagerUserId: projectManagerUserId ? Number(projectManagerUserId) : null,
      },
    });

    res.status(201).json(newTeam);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};

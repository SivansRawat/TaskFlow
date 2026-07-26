import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { organizationId } = req.query;
  try {
    const orgId = organizationId ? Number(organizationId) : 1;
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { organizationId: orgId },
          { organizationId: null },
        ],
      },
      select: {
        userId: true,
        cognitoId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        teamId: true,
        organizationId: true,
        organization: true,
      },
    });
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const isNum = !isNaN(Number(cognitoId));
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { cognitoId: cognitoId },
          { username: cognitoId },
          ...(isNum ? [{ userId: Number(cognitoId) }] : []),
        ],
      },
      select: {
        userId: true,
        cognitoId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        teamId: true,
        organizationId: true,
        organization: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Find user using case-insensitive search
    const allUsers = await prisma.user.findMany();
    const user = allUsers.find(
      (u) =>
        u.username.toLowerCase() === trimmedUsername.toLowerCase() ||
        (u.email && u.email.toLowerCase() === trimmedUsername.toLowerCase())
    );

    if (!user) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    // If user has a password set, check with bcrypt or fallback to plain text comparison
    if (user.password) {
      let isMatch = false;
      if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
        isMatch = await bcrypt.compare(trimmedPassword, user.password);
      } else {
        isMatch = user.password === trimmedPassword;
      }

      if (!isMatch) {
        res.status(400).json({ message: "Invalid username or password" });
        return;
      }
    }

    res.json({
      message: "Login successful",
      newUser: {
        userId: user.userId,
        cognitoId: user.cognitoId,
        username: user.username,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        teamId: user.teamId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      cognitoId,
      profilePictureUrl = "p1.jpeg",
      teamId,
    } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    let validTeamId: number | null = teamId ? Number(teamId) : null;
    if (validTeamId) {
      const teamExists = await prisma.team.findUnique({ where: { id: validTeamId } });
      if (!teamExists) {
        validTeamId = null;
      }
    }

    const uniqueCognitoId = cognitoId || `user_${Date.now()}`;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { cognitoId: uniqueCognitoId },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      res.status(400).json({ message: "User with this username or email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        cognitoId: uniqueCognitoId,
        profilePictureUrl,
        teamId: validTeamId,
      },
      select: {
        userId: true,
        cognitoId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        teamId: true,
      },
    });

    res.status(201).json({ message: "User Created Successfully", newUser });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
};

export const updateUserTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { teamId } = req.body;

    const updatedUser = await prisma.user.update({
      where: { userId: Number(userId) },
      data: {
        teamId: teamId ? Number(teamId) : null,
      },
      select: {
        userId: true,
        cognitoId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        teamId: true,
      },
    });

    res.json({ message: "User team updated successfully", updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: `Error updating user team: ${error.message}` });
  }
};

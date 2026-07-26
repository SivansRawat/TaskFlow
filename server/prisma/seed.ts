import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData() {
  await prisma.activity.deleteMany({});
  await prisma.taskAssignment.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.projectTeam.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.organization.deleteMany({});
  console.log("Cleared all multi-tenant tables.");
}

async function main() {
  await deleteAllData();

  // 1. Create Organizations
  const acmeOrg = await prisma.organization.create({
    data: {
      id: 1,
      name: "Acme Corp",
      slug: "acme-corp",
    },
  });

  const stripeOrg = await prisma.organization.create({
    data: {
      id: 2,
      name: "Stripe Tech",
      slug: "stripe-tech",
    },
  });

  console.log("Seeded Organizations: Acme Corp (ID: 1), Stripe Tech (ID: 2)");

  const dataDirectory = path.join(__dirname, "seedData");

  // 2. Seed Acme Corp Teams
  const teamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "team.json"), "utf-8"));
  for (const t of teamData) {
    await prisma.team.create({ data: { ...t, organizationId: 1 } });
  }

  // 3. Seed Acme Corp Projects
  const projectData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "project.json"), "utf-8"));
  for (const p of projectData) {
    await prisma.project.create({ data: { ...p, organizationId: 1 } });
  }

  // 4. Seed Acme Corp ProjectTeams
  const projectTeamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "projectTeam.json"), "utf-8"));
  for (const pt of projectTeamData) {
    await prisma.projectTeam.create({ data: pt });
  }

  // 5. Seed Acme Corp Users
  const userData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "user.json"), "utf-8"));
  for (const u of userData) {
    await prisma.user.create({ data: { ...u, organizationId: 1 } });
  }

  // 6. Seed Acme Corp Tasks
  const taskData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "task.json"), "utf-8"));
  for (const t of taskData) {
    await prisma.task.create({ data: t });
  }

  // 7. Seed Attachments & Comments & Assignments
  const attachmentData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "attachment.json"), "utf-8"));
  for (const a of attachmentData) {
    await prisma.attachment.create({ data: a });
  }

  const commentData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "comment.json"), "utf-8"));
  for (const c of commentData) {
    await prisma.comment.create({ data: c });
  }

  const taskAssignData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "taskAssignment.json"), "utf-8"));
  for (const ta of taskAssignData) {
    await prisma.taskAssignment.create({ data: ta });
  }

  // 8. Seed Isolated Data for Organization #2 (Stripe Tech)
  const stripeUser = await prisma.user.create({
    data: {
      userId: 99,
      cognitoId: "cognito-stripe-admin-99",
      username: "SarahStripe",
      email: "sarah@stripe.com",
      organizationId: 2,
    },
  });

  const stripeProject = await prisma.project.create({
    data: {
      id: 99,
      name: "Stripe Billing Infrastructure 2026",
      description: "Isolated confidential payments infrastructure project for Stripe Tech.",
      organizationId: 2,
    },
  });

  await prisma.task.create({
    data: {
      id: 99,
      issueKey: "STRIPE-101",
      title: "Deploy Multi-Currency Payment Webhook Engine",
      description: "Confidential billing task strictly scoped to Stripe Tech organization.",
      status: "Work In Progress",
      priority: "Urgent",
      points: 13,
      projectId: 99,
      authorUserId: 99,
      assignedUserId: 99,
    },
  });

  console.log("Seeded Stripe Tech (Org #2) with isolated project, user, and task!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

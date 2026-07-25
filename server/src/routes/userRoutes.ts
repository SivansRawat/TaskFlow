import { Router } from "express";
import { getUser, getUsers, loginUser, postUser, updateUserTeam } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.post("/login", loginUser);
router.patch("/:userId/team", updateUserTeam);
router.get("/:cognitoId", getUser);

export default router;

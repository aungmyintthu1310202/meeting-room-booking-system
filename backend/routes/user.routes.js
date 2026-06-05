import express from "express";
import { authMiddleware, roleCheck } from "../src/middlewares/authMiddleware.js";
import { listUsers, createUser, deleteUser, updateUserRole } from "../src/controllers/user.controller.js";

const router = express.Router();

router.get("/", listUsers);
router.post("/", authMiddleware, roleCheck(["admin"]), createUser);
router.delete("/:id", authMiddleware, roleCheck(["admin"]), deleteUser);
router.patch("/:id", authMiddleware, roleCheck(["admin"]), updateUserRole);

export default router;

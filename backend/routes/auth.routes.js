import express from  "express";
import {
    Login
} from "../src/controllers/auth.controller.js";

const router = express.Router();

router.post("/login", Login);

export default router;
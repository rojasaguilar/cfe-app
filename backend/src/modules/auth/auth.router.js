import express from "express";
import { signup, login, getMe, protect } from "./auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/me", protect, getMe);

export default router;

import { Router } from "express";
import { protect } from "./../modules/auth/auth.controller.js";
import { connect } from "./events.controller.js";

const router = Router();

router.get("/", protect, connect);

// router.get("/", connect);

export default router;

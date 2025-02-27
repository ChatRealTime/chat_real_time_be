import express from "express";
import { updateAvatar_api } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/update-profile", protectRoute, updateAvatar_api);

export default router;

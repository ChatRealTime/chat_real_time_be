import express from "express";
import {
  checkAuth_api,
  login_api,
  logout_api,
  signup_api,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//api signup route
router.post("/signup", signup_api);

//api login route
router.post("/login", login_api);

//api logout route
router.post("/logout", logout_api);

router.get("/check-auth", protectRoute, checkAuth_api);

export default router;

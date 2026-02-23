import express from "express";
import { logout, signup, singin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", singin);
authRouter.post("/logout", logout);

export default authRouter;

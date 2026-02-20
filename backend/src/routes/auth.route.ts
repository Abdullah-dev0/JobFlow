import express from "express";
import { signup, singin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", singin);

export default authRouter;

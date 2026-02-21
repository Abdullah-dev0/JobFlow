import { Router } from "express";
import { getUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", getUser);

export default userRouter;

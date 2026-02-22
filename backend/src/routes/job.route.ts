import express from "express";
import { createJob, deleteJob, getJobs, updateJob } from "../controllers/job.controller.js";

const jobRouter = express.Router();

jobRouter.post("/create", createJob);
jobRouter.patch("/update/:id", updateJob);
jobRouter.delete("/delete", deleteJob);
jobRouter.get("/All", getJobs);

export default jobRouter;

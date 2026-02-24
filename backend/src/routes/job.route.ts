import express from "express";
import { createJob, deleteJob, getJobbyId, getJobs, updateJob } from "../controllers/job.controller.js";

const jobRouter = express.Router();

jobRouter.post("/create", createJob);
jobRouter.patch("/update/:id", updateJob);
jobRouter.delete("/delete", deleteJob);
jobRouter.get("/All", getJobs);
jobRouter.get("/:id", getJobbyId);

export default jobRouter;

import { Router } from "express";
import { CandidateController } from "../controllers/candidate.controller";

export const candidateRoutes = () => {
  const app = Router();

  app.post("/", new CandidateController().create);
  return app;
};

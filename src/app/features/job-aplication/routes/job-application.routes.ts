import { Router } from "express";
import { JobApplicationController } from "../controllers/job-application.controller";
import { LoginValidator } from "../../user/validators/login.validator";
import { CandidateValidator } from "../../candidate/validators/candidate.validator";

export const jobApplicationRoutes = () => {
  const app = Router({
    mergeParams: true,
  });

  const logged = [
    LoginValidator.checkToken,
    CandidateValidator.checkCandidateToken,
  ];

  app.post("/", logged, new JobApplicationController().create);

  // LISTA VAGAS APLICADAS - RECRUITER
  app.get("/job", logged, new JobApplicationController().listByCandidate);

  return app;
};

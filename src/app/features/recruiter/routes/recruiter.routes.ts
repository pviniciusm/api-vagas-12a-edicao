import { Router } from "express";
import { jobApplicationRoutes } from "../../job-aplication/routes/job-application.routes";
import { LoginValidator } from "../../user/validators/login.validator";
import { RecruiterController } from "../controllers/recruiter.controller";
import { RecruiterValidator } from "../validators/recruiter.validator";

export const recruiterRoutes = () => {
  const app = Router();

  const logged = [
    LoginValidator.checkToken,
    RecruiterValidator.checkRecruiterToken,
  ];

  app.post("/", new RecruiterController().create);
  app.get("/", logged, new RecruiterController().list);

  app.use("/:idJob/application", logged, jobApplicationRoutes());

  return app;
};

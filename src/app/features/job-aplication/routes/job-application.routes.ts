import { Router } from "express";
import { JobApplicationController } from "../controller/jobApplication.controller";
import { LoginValidator } from "../../user/validators/login.validator";
import { CandidateValidator } from "../../candidate/validators/candidate.validator";

export const jobApplicationRoutes = () => {
    const app = Router({
        mergeParams: true,
    });

    const logged = [LoginValidator.checkToken, CandidateValidator.checkCandidateToken];

    app.post("/", logged, new JobApplicationController().create);

    return app;
};

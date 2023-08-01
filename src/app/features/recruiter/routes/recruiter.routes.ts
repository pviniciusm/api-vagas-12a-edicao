import { Router } from "express";
import { RecruiterController } from "../controllers/recruiter.controller";

export const recruiterRoutes = () => {
    const app = Router();

    app.post("/", new RecruiterController().create);
    app.get("/", new RecruiterController().list);

    return app;
};

import cors from "cors";
import express, { Request, Response } from "express";
import { recruiterRoutes } from "../../app/features/recruiter/routes/recruiter.routes";

export const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get("/", (req: Request, res: Response) => res.status(200).json({ ok: true, message: "API JOBS" }));

    // ROTAS
    app.use("/recruiter", recruiterRoutes());

    return app;
};

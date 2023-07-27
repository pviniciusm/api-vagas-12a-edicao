import cors from "cors";
import express, { Request, Response } from "express";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get("/", (req: Request, res: Response) =>
    res.status(200).json({ ok: true, message: "API JOBS" })
  );

  // ROTAS

  return app;
};

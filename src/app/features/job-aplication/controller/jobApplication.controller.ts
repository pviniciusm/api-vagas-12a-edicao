import { Request, Response } from "express";
import { CreateJobApplicationUsecase } from "../useCases/create-job-application.useCase";

// POST /job
// POST /job/:id/application

// POST /application  { id_job: 123 }

// idCandidato => req.headers
// idVaga => req.params

export class JobApplicationController {
    public async create(req: Request, res: Response) {
        try {
            const { idJob } = req.params;
            const { loggedUserId } = req.headers;

            const usecase = new CreateJobApplicationUsecase();
            const result = await usecase.execute({ idJob, idCandidate: loggedUserId as string });

            return res.status(result.code).send(result);
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }
}

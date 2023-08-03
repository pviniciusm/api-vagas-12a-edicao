import { Database } from "../../../../main/database/database.connection";
import { Job } from "../../../models/job.model";
import { JobEntity } from "../../../shared/database/entities/job.entity";
import { UserRepository } from "../../user/repositories/user.repository";

export class JobRepository {
    private repository = Database.connection.getRepository(JobEntity);

    public async create(job: Job) {
        const entity = this.repository.create({
            id: job.id,
            description: job.description,
            enterprise: job.enterprise,
            limitDate: job.limitDate,
            isActive: job.isActive,
            idRecuiter: job.recruiter.id,
            maxCandidates: job.maxCandidates,
        });

        await this.repository.save(entity);
    }

    public async getById(id: string): Promise<Job | undefined> {
        const result = await this.repository.findOne({
            where: {
                id,
            },
            relations: {
                recruiter: true,
            },
        });

        return JobRepository.mapRowToModel(result);
    }

    public static mapRowToModel(job?: JobEntity | null) {
        if (!job) {
            return undefined;
        }

        const recruiter = UserRepository.mapRowToModel(job.recruiter);

        return Job.create(job, recruiter!);
    }
}

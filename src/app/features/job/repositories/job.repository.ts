import { Database } from "../../../../main/database/database.connection";
import { Job } from "../../../models/job.model";
import { JobEntity } from "../../../shared/database/entities/job.entity";

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
}

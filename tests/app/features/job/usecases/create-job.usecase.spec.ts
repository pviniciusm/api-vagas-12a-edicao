import { Database } from "../../../../../src/main/database/database.connection";
import {
  CreateJobUsecase,
  CreateJobParams,
} from "../../../../../src/app/features/job/usecases/create-job.usecasse";
import { Job } from "../../../../../src/app/models/job.model";
import { UserType } from "../../../../../src/app/models/user-type.model";
import { User } from "../../../../../src/app/models/user.model";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { JobRepository } from "../../../../../src/app/features/job/repositories/job.repository";

describe("Create-job usecase", () => {
  beforeAll(async () => {
    await Database.connect();
  });

  afterAll(async () => {
    await Database.connection.destroy();
  });

  const createSut = () => {
    return new CreateJobUsecase();
  };

  const userMockSut = () => {
    return new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Recruiter,
      "any_enterpriseName"
    );
  };

  const jobMockSut = () => {
    return new Job(
      "any_description",
      "any_enterprise",
      new Date(),
      true,
      userMockSut(),
      1
    );
  };

  test("Retorna undefined quando não encontrar o recruiter", async () => {
    const sut = createSut();
    const params: CreateJobParams = {
      description: "any_description",
      enterprise: "any_enterprise",
      limitDate: new Date(),
      isActive: true,
      maxCandidates: 1,
      recruiterId: "any_id",
    };

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockResolvedValue(undefined);
    jest.spyOn(JobRepository.prototype, "create").mockResolvedValue();

    const result = await sut.execute(params);

    expect(result.ok).toBe(false);
    expect(result.message).toStrictEqual("Recruiter not found");
    expect(result.code).toBe(404);
    expect(result).not.toHaveProperty("data");
  });
});

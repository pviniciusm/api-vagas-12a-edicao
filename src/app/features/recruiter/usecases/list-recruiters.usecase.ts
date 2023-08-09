import { UserType } from "../../../models/user-type.model";
import { CacheRepositoty } from "../../../shared/database/repositories/cache.repository";
import { Result, Usecase } from "../../../shared/util";
import { UserRepository } from "../../user/repositories/user.repository";

export class ListRecruitersUsecase implements Usecase {
  public async execute(): Promise<Result> {
    const repository = new UserRepository();
    const cacheRepositoty = new CacheRepositoty();

    const cacheResult = await cacheRepositoty.get("users");

    if (cacheResult) {
      return {
        ok: true,
        message: "Recruiters successfully listed in cache",
        data: cacheResult,
        code: 200,
      };
    }

    const result = await repository.list(UserType.Recruiter);
    const data = result?.map((recruiter) => recruiter.toJson());

    await cacheRepositoty.set("users", data);

    return {
      ok: true,
      message: "Recruiters successfully listed",
      data,
      code: 200,
    };
  }
}

import { ListRecruitersUsecase } from "../../../../../src/app/features/recruiter/usecases/list-recruiters.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserType } from "../../../../../src/app/models/user-type.model";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";

describe("List Recruiter Usecase", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const createSut = () => {
    return new ListRecruitersUsecase();
  };

  const userMockSut = (email: string) => {
    return new User(
      "any_name",
      email,
      "any_password",
      UserType.Recruiter,
      "any_enterprise_name"
    );
  };

  test("Retorna do cache uma lista preenchida.", async () => {
    const user = userMockSut("any_email").toJson();
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "list").mockResolvedValue([]);
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue([user]);
    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

    const result = await sut.execute();

    expect(result.ok).toBe(true);
    expect(result.message).toBe("Recruiters successfully listed in cache");
    expect(result.code).toBe(200);
    expect(result.data).toStrictEqual([user]);
    expect(result.data).toHaveLength(1);
  });

  test("Retorna uma lista populada com dois usuários do banco.", async () => {
    const user1 = userMockSut("any_email_1");
    const user2 = userMockSut("any_email_2");
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "list")
      .mockResolvedValue([user1, user2]);
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

    const result = await sut.execute();

    expect(result.ok).toBe(true);
    expect(result.message).toBe("Recruiters successfully listed");
    expect(result.code).toBe(200);
    expect(result.data).toStrictEqual([user1.toJson(), user2.toJson()]);
    expect(result.data).toHaveLength(2);

    expect(result).toEqual({
      ok: true,
      message: "Recruiters successfully listed",
      data: [user1.toJson(), user2.toJson()],
      code: 200,
    });
  });
});

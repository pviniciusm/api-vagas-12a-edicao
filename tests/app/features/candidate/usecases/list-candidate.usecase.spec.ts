import { UserType } from "../../../../../src/app/models/user-type.model";
import { User } from "../../../../../src/app/models/user.model";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";
import { ListCandidateUsecase } from "../../../../../src/app/features/candidate/usecases/list-candidate.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";

describe("List-candidate usecase", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const createSut = () => new ListCandidateUsecase();

  const userMockSut = (email: string) => {
    return new User("any_name", email, "any_password", UserType.Candidate);
  };

  test("Retorna do cache uma lista preenchida.", async () => {
    const user = userMockSut("any_email");
    const sut = createSut();

    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue([user.toJson()]);
    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();
    jest.spyOn(UserRepository.prototype, "list").mockResolvedValue([]);

    const result = await sut.execute();

    expect(result.ok).toBe(true);
    expect(result.message).toStrictEqual(
      "Candidates successfully listed in cache"
    );
    expect(result.data).toStrictEqual([user.toJson()]);
    expect(result.code).toBe(200);
    expect(result.data).toHaveLength(1);
  });

  test("retorna do banco uma lista com 2 usuarios", async () => {
    const sut = createSut();
    const user = userMockSut("any_email");
    const user2 = userMockSut("any_email2");

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();
    jest
      .spyOn(UserRepository.prototype, "list")
      .mockResolvedValue([user, user2]);

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
    expect(result.message).toStrictEqual("Candidates successfully listed");
    expect(result.data).toStrictEqual([user.toJson(), user2.toJson()]);
    expect(result.data).toHaveLength(2);
    expect(result.code).toBe(200);
  });

  test("retorna uma lista vazia do banco quando nao houver candidatos", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();
    jest.spyOn(UserRepository.prototype, "list").mockResolvedValue([]);

    const result = await sut.execute();

    expect(result.ok).toBe(true);
    expect(result.message).toStrictEqual("Candidates successfully listed");
    expect(result.data).toStrictEqual([]);
    expect(result.data).toHaveLength(0);
    expect(result.code).toBe(200);
  });
});

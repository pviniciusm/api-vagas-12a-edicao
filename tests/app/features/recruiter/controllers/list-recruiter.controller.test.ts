import supertest from "supertest";

import { UserType } from "../../../../../src/app/models/user-type.model";
import { User } from "../../../../../src/app/models/user.model";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { JwtService } from "../../../../../src/app/shared/services/jwt.service";
import { createApp } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";

describe("Recuiter Controller - LIST", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await Database.connection.manager.delete(UserEntity, {});
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const createSut = () => {
    return createApp(); // EXPRESS
  };

  const makeTokenSut = (type: UserType) => {
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      type,
      "any_enterprise"
    );

    const token = new JwtService().createToken(user.toJson());

    return {
      user,
      token,
    };
  };

  const makeEntitySut = async (user: User) => {
    await Database.connection.manager.transaction(async (trans) => {
      const data = trans.create(UserEntity, {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        enterpriseName: user.enterpriseName,
        type: user.type,
      });

      await trans.save(UserEntity, data);
    });
  };

  const makeCacheSut = async (data: User[]) => {
    await CacheDatabase.connection.set("recruiters", JSON.stringify(data));
  };

  const route = "/recruiter";

  test("Retorna não autorizado, quando não informado o token", async () => {
    const sut = createSut();

    const result = await supertest(sut).get(route).send();

    expect(result).toBeDefined();
    expect(result.status).toEqual(401);

    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty("code", 401);
    expect(result.body).toHaveProperty("message", "Invalid credentials");
    expect(result.body).not.toHaveProperty("data");
  });

  test("Retorna proibido, quando não informado o token do tipo recrutador", async () => {
    const sut = createSut();
    const { token } = makeTokenSut(UserType.Candidate);

    const result = await supertest(sut)
      .get(route)
      .set("Authorization", `${token}`) // PASSANDO TOKEN DO TIPO CANDIDATE
      .send();

    expect(result).toBeDefined();
    expect(result.status).toEqual(403);

    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty("code", 403);
    expect(result.body).toHaveProperty(
      "message",
      "User does not have the proper profile"
    );
    expect(result.body).not.toHaveProperty("data");
  });

  test("Retorna a lista do banco com os recrutadores, quando logado", async () => {
    const sut = createSut();
    const { token, user } = makeTokenSut(UserType.Recruiter);
    await makeEntitySut(user);

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

    const result = await supertest(sut)
      .get(route)
      .set("Authorization", `${token}`) // PASSANDO TOKEN DO TIPO RECRUTADOR
      .send();

    expect(result).toBeDefined();
    expect(result.status).toEqual(200);

    expect(result.body).toHaveProperty("ok", true);
    expect(result.body).toHaveProperty("code", 200);
    expect(result.body).toHaveProperty(
      "message",
      "Recruiters successfully listed"
    );
    expect(result.body.data).toHaveLength(1);
  });
});

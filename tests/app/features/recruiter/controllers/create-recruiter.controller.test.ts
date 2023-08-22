import supertest from "supertest";

import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";

describe("Recruiter Controller - CREATE", () => {
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

  const createBodySut = () => {
    return {
      email: "any_email",
      name: "any_name",
      password: "any_password",
      enterpriseName: "any_enterprise",
    };
  };

  const route = "/recruiter";

  test("Deve retornar erro (400) quando o email não for informado no body.", async () => {
    const sut = createSut();

    const result = await supertest(sut).post(route).send({
      name: "any_name",
      password: "any_password",
      enterpriseName: "any_enterprise",
    });

    expect(result).toBeDefined();
    expect(result.status).toEqual(400);

    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty("message", "Email not provided");
    expect(result.body).not.toHaveProperty("data");
    expect(result.body).not.toHaveProperty("code");
  });

  test("Deve retornar (201) quando criado com sucesso.", async () => {
    const sut = createSut();
    const bodySut = createBodySut();

    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await supertest(sut).post(route).send(bodySut);

    expect(result).toBeDefined();
    expect(result.status).toEqual(201);

    expect(result.body).toHaveProperty("ok", true);
    expect(result.body).toHaveProperty(
      "message",
      "Recruiter successfully created"
    );
    expect(result.body).toHaveProperty("code", 201);
    expect(result.body).not.toHaveProperty("data");
  });

  test("Deve retornar erro (400) quando usuário (email) já existir", async () => {
    const sut = createSut();
    const bodySut = createBodySut();

    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await supertest(sut).post(route).send(bodySut);

    expect(result).toBeDefined();
    expect(result.status).toEqual(400);

    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty("message", "User already exists");
    expect(result.body).toHaveProperty("code", 400);
    expect(result.body).not.toHaveProperty("data");
  });
});

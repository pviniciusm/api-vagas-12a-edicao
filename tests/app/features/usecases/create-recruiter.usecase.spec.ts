import { CreateRecruiterUsecase } from "../../../../src/app/features/recruiter/usecases/create-recruiter.usecase";
import { UserRepository } from "../../../../src/app/features/user/repositories/user.repository";
import { UserType } from "../../../../src/app/models/user-type.model";
import { User } from "../../../../src/app/models/user.model";
import { Database } from "../../../../src/main/database/database.connection";

describe("Create Recruiter Usecase", () => {
  beforeAll(async () => {
    await Database.connect();
  });

  afterAll(async () => {
    await Database.connection.destroy();
  });

  const createSut = () => {
    return new CreateRecruiterUsecase();
  };

  // verificar se o user ja existe (email)
  // Se user existe com o mesmo email, retorna erro 400
  test("Retorna 400 caso usuario(email) já exista", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Recruiter,
      "any_enterpriseName"
    );
    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(user);

    const result = await sut.execute({
      email: "any_email",
      name: "any_name",
      password: "any_password",
      enterpriseName: "any_enterpriseName",
    });

    expect(result.ok).toBe(false);
    expect(result.message).toBe("User already exists");
    expect(result.code).toBe(400);
    expect(result).not.toHaveProperty("data");
  });

  // teste criar o usuario
});

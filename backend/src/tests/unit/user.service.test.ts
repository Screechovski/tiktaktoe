import { UserEntity } from "../../entity/user.entity";
import { AppDataSource } from "../../services/db.service";
import { createUser, getUser, hasUser } from "../../services/user.service";

const mockSend = jest.fn((d: string) => console.log(d));

beforeAll(async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log("ERROR: ", error);
  }
});

it("create user", async () => {
  const user = await createUser("ip", "test_user", mockSend);

  expect(hasUser(user.ip)).toBeTruthy();
  expect(getUser(user.ip)).toEqual(user);

  const res = await AppDataSource.manager.find(UserEntity);
  console.log(res);
});

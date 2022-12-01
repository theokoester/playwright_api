import { expect, test } from "@playwright/test";
import { User } from "../models/user.model";
// import {faker} from '@faker-js/faker'; this imports all locales
import { faker } from '@faker-js/faker/locale/de';


const baseURL: string = "https://dummyapi.io";

test.describe("tests users", () => {
  let userContainerVar: User = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  };

  let amountUsersCreated: number = 10;

  test("should list the first 10 users", async ({ request }) => {
    const users = await request.get(baseURL + "/data/v1/user?created=1", { //this url gets our users only
      params: { limit: 10 },
    });
    expect(users.ok()).toBeTruthy();

    const respBody = await users.json();
    expect(respBody.total).toBe(8);
    expect(respBody.data.length).toBe(amountUsersCreated);
  });

  test("it should return an empty result array", async ({ request }) => {
    const users = await request.get(baseURL + "/data/v1//user", {
      params: { limit: 40, page: 3 },
    });

    expect(users.ok()).toBeTruthy();
    const respBody = await users.json();
    expect(respBody.data.length).toBe(0);
  });

  test("should create an user", async ({ request }) => {
    const user = await request.post(baseURL + "/data/v1/user/create", {
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
      },
    });

    expect(user.ok()).toBeTruthy();

    amountUsersCreated ++;
    const respBody = await user.json();
    userContainerVar.id = await respBody.id;
    userContainerVar.firstName = await respBody.firstName;
    userContainerVar.lastName = await respBody.lastName;
  });

  test.skip("update the names of an existing user by its id", async ({
    request,
  }) => {
    const userUpdate = await request.put(
      baseURL + "/data/v1/user/" + userContainerVar.id,
      {
        data: { firstName: "Maximilian", lastName: "Müller" },
      }
    );

    expect(userUpdate.ok()).toBeTruthy();

    const userUpdateRespBody = await userUpdate.json();
    expect(userUpdateRespBody.firstName).toBe('Maximilian');
    expect(userUpdateRespBody.lastName).toBe('Müller');

  });
});

test.describe("tests the possible errors returned from the api", () => {
  test("it should return an error because of unvalid path", async ({
    request,
  }) => {
    const createUser = await request.post(baseURL + "/data/v1//usser/create", {
      data: { firstName: "Max", email: "mail@example.com" },
    });
    expect(createUser.ok()).toBeFalsy();

    const respBody = await createUser.json();
    expect(respBody.error).toBe("PATH_NOT_FOUND");
  });

  test("it should return an error because of unvalid body", async ({
    request,
  }) => {
    const createUser = await request.post(baseURL + "/data/v1/user/create", {
      data: {
        firstName: 10,
        email: "email@example.com",
      },
    });

    expect(createUser.ok()).toBeFalsy();

    const respBody = await createUser.json();
    expect(respBody.error).toBe("BODY_NOT_VALID");
  });

  test("it should return an error because of wrong path", async ({
    request,
  }) => {
    const createUser = await request.post(baseURL + "/data/v1//user/create", {
      data: {
        firstName: 10,
        email: "email@example.com",
      },
    });

    expect(createUser.ok()).toBeFalsy();

    const respBody = await createUser.json();
    expect(respBody.error).toBe("PARAMS_NOT_VALID");
  });

  test("it should return an error because the user doesn't exist", async ({
    request,
  }) => {
    const user = await request.get(
      baseURL + "/data/v1/user/60d0fe4f5361236168a109cb"
    );
    expect(user.ok()).toBeFalsy();

    const respBody = await user.json();
    expect(respBody.error).toBe("RESOURCE_NOT_FOUND");
  });
});

test.describe("tests with a wrong app-id token", () => {
  test.use({
    extraHTTPHeaders: {
      "app-id": "foobar",
    },
  });
  test("wrong api credentials", async ({ request }) => {
    const createUser = await request.post(baseURL + "/data/v1/usser/create", {
      data: { firstName: "Max", email: "mail@example.com" },
    });
    expect(createUser.ok()).toBeFalsy();

    const respBody = await createUser.json();
    expect(respBody.error).toBe("APP_ID_NOT_EXIST");
  });
});

test.describe("tests with a missing app-id token", () => {
  test.use({ extraHTTPHeaders: {} });
  test("wrong api credentials", async ({ request }) => {
    const createUser = await request.post(baseURL + "/data/v1/usser/create", {
      data: { firstName: "Max", email: "mail@example.com" },
    });
    expect(createUser.ok()).toBeFalsy();

    const respBody = await createUser.json();
    expect(respBody.error).toBe("APP_ID_MISSING");
  });
});

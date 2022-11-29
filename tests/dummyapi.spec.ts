import { expect, test } from "@playwright/test";

test.describe("tests dummyapi.io", () => {
  const baseURL: string = "https://dummyapi.io";

/*   test("should list the first 10 users from 99 in total", async ({
    request,
  }) => {
    const users = await request.get(baseURL + "/data/v1//user", {
      params: { limit: 10 },
    });
    expect(users.ok()).toBeTruthy();

    const respBody = await users.json();
    expect(respBody.total).toBe(100);
    expect(respBody.data.length).toBe(10);
  });

  test("it should return an empty result array", async ({ request }) => {
    const users = await request.get(baseURL + "/data/v1//user", {
      params: { limit: 40, page: 3 },
    });

    expect(users.ok()).toBeTruthy();
    const respBody = await users.json();
    expect(respBody.data.length).toBe(0);
  });

  test("it should return an error because of unvalid path", async ({
    request,
  }) => {
    const createUser = await request.post(baseURL + "/data/v1//usser/create", {
      data: { firstName: "Max", email: "mail@example.com" },
    });
    expect(createUser.ok()).toBeFalsy();

    const respBody = await createUser.json();
    expect(respBody.error).toBe("PATH_NOT_FOUND");
  }); */

  test("it should return an error because of unvalid body", async ({
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
});

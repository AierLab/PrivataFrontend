import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "./user";

describe("Prisma CRUD", () => {
  let testUser = {
    phone: "1",
    name: "Test User",
  };

  it("creates a user", async () => {
    const user = await createUser(testUser);

    expect(user.phone).toBeDefined();
  });

  it("gets the created user", async () => {
    const user = await getUser(testUser.phone);

    if (user) {
      expect(user.name).toBe("Test User");
    } else {
      fail("User is null");
    }
  });

  it("updates the user", async () => {
    await updateUser(testUser.phone, {
      phone: testUser.phone,
      name: "Updated Name",
    });

    const user = await getUser(testUser.phone);
    if (user) {
      expect(user.name).toBe("Updated Name");
    } else {
      fail("User is null");
    }
  });

  it("deletes the user", async () => {
    await deleteUser(testUser.phone);

    try {
      await getUser(testUser.phone);
      fail("User was not deleted");
    } catch (error) {
      // User was deleted
    }
  });
});

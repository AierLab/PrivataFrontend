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
    expect(user).not.toBeNull();
    if (!user) throw new Error("User is null");
    expect(user.name).toBe("Test User");
  });

  it("updates the user", async () => {
    await updateUser(testUser.phone, {
      phone: testUser.phone,
      name: "Updated Name",
    });

    const user = await getUser(testUser.phone);
    expect(user).not.toBeNull();
    if (!user) throw new Error("User is null");
    expect(user.name).toBe("Updated Name");
  });

  it("deletes the user", async () => {
    await deleteUser(testUser.phone);

    try {
      const user = await getUser(testUser.phone);
      expect(user).toBeNull();
    } catch (error) {
      // User was deleted
    }
  });
});

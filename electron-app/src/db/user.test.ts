import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  createPost,
  getPost,
} from "./user";

describe("Prisma CRUD", () => {
  let testUser = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
  };

  let testPost = {
    id: 1,
    title: "Test Post",
    authorId: testUser.id,
    published: true,
  };

  it("creates a user", async () => {
    const user = await createUser(testUser);

    expect(user.id).toBeDefined();
  });

  it("gets the created user", async () => {
    const user = await getUser(testUser.id);

    expect(user.email).toBe("test@example.com");
  });

  it("updates the user", async () => {
    await updateUser(testUser.id, {
      id: testUser.id,
      email: "test2@example.com",
      name: "Updated Name",
    });

    const user = await getUser(testUser.id);
    expect(user.name).toBe("Updated Name");
  });

  it("deletes the user", async () => {
    await deleteUser(testUser.id);

    try {
      await getUser(testUser.id);
      fail("User was not deleted");
    } catch (error) {
      // User was deleted
    }
  });
});

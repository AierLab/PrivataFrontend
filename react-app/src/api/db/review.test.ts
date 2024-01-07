// import {
//   ReviewStorage,
//   createReviewStorage,
//   getReviewStorage,
//   updateReviewStorage,
//   deleteReviewStorage,
// } from "./review";

// describe("Prisma CRUD", () => {
//   let testReview: ReviewStorage = {
//     id: 1,
//     profile_id: "media",
//     RequestUser: "18330785221",
//     mentioned: "18330785221",
//     filename: "Test Filename",
//     filesize: 100,
//     filetype: "Test Type",
//   };

//   it("creates a review", async () => {
//     const review = await createReviewStorage(testReview);

//     expect(review.id).toBeDefined();
//   });

//   it("gets the created review", async () => {
//     const review = await getReviewStorage(testReview.id);

//     if (review) {
//       expect(review.profile_id).toBe("media");
//     } else {
//       fail("Review is null");
//     }
//   });

//   it("updates the review", async () => {
//     await updateReviewStorage(testReview.id, {
//       ...testReview,
//       profile_id: "",
//       // 如果你更新了其他属性，也需要在这里添加
//     });

//     const review = await getReviewStorage(testReview.id);
//     if (review) {
//       expect(review.profile_id).toBe("Updated Profile");
//     } else {
//       fail("Review is null");
//     }
//   });

//   it("deletes the review", async () => {
//     await deleteReviewStorage(testReview.id);

//     try {
//       await getReviewStorage(testReview.id);
//       fail("Review was not deleted");
//     } catch (error) {
//       // Review was deleted
//     }
//   });
// });

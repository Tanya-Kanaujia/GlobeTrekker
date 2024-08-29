const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilities/asyncWrap.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

//Review Route(POST)
router.post("/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControllers.createReview)
);

//Review Route(DELETE)
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.destroyReview)
);

module.exports = router;
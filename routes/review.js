const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {  reviewSchema } = require("../schema.js");

const { isLoggedIn , validateReview,isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/review");

//post Reviews Route
router.post("/",isLoggedIn , validateReview, wrapAsync(reviewController.postReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(reviewController.destroyRoute));

module.exports = router;
const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {  reviewSchema } = require("../schema.js");

const { isLoggedIn , validateReview,isReviewAuthor} = require("../middleware");
const reviewcontroller = require("../controllers/review");

//post Reviews
router.post("/",isLoggedIn , validateReview, wrapAsync(reviewcontroller.postReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(reviewcontroller.destroyRoute));

module.exports = router;
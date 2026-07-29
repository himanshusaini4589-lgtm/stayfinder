const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {  reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , validateReview,isReviewAuthor} = require("../middleware");

//post Reviews
router.post("/",isLoggedIn , validateReview, wrapAsync(async (req,res)=>{

    let {id} = req.params;
    
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${id}`);
}));


//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(async(req,res) =>{
    let {id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;
const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {  reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , validateReview} = require("../middleware");

//post Reviews
router.post("/",isLoggedIn , validateReview, wrapAsync(async (req,res)=>{

    let {id} = req.params;
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    const review = new Review(req.body.review);
    const listing = await Listing.findById(id);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${id}`);
}));


//Delete Review Route
router.delete("/:reviewId",isLoggedIn ,wrapAsync(async(req,res) =>{
    let {id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;
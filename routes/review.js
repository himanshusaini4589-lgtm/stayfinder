const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {  reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);

    if(result.error){
        let errMsg = result.error.details
            .map((el)=>el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
}

//post Reviews
router.post("/", validateReview, wrapAsync(async (req,res)=>{
    console.log(req.body);

    console.log(req.body.review);
    let {id} = req.params;
   
    const review = new Review(req.body.review);
    const listing = await Listing.findById(id);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));


//Delete Review Route
router.delete("/:reviewId",wrapAsync(async(req,res) =>{
    let {id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;
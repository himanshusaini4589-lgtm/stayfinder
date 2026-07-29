
const {  reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async (req,res)=>{
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
};

module.exports.destroyRoute = async(req,res) =>{
    let {id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
}
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const { isLoggedIn , validateListing} = require("../middleware");


// index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
    
}));

router.get("/new",isLoggedIn,wrapAsync(async (req,res)=>{
    res.render("listings/new"); 
}));

router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
    //let {title ,description ,image,price,country,location} = req.body;
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created !");
        res.redirect("/listings");
    
}));

router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listings/edit",{listing});
}));


router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;

    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
    
}));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/show",{listing});
    
}));

router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;
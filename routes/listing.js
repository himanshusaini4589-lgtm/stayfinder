const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");

const validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);

    if(result.error){
        let errMsg = result.error.details
            .map((el)=>el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
}


// index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}));

router.get("/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs",); 
}));

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    //let {title ,description ,image,price,country,location} = req.body;
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created !");
        res.redirect("/listings");
    
}));

router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listings/edit.ejs",{listing});
}));


router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    console.log(req.body);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
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
    res.render("listings/show.ejs",{listing});
    
}));

router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;
const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
    
}

module.exports.renderNewForm = async (req,res)=>{
    res.render("listings/new"); 
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;

    const listing = await Listing.
    findById(id)
    .populate({path : "reviews", populate : { path : "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/show",{listing});
}

module.exports.createNewListing = async (req,res,next)=>{
    //let {title ,description ,image,price,country,location} = req.body;
    if (!req.file) {
        req.flash("error", "Please upload an image.");
        return res.redirect("/listings/new");
    }
        const url = req.file.path;
        const filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url , filename};
        await newListing.save();
        req.flash("success", "New Listing Created !");
        res.redirect("/listings");
    
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.editFormRender = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listings/edit",{listing});
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}
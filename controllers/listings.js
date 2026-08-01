const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (search && search.trim() !== "") {
        const escapedSearch = escapeRegex(search.trim());
        const regex = new RegExp(escapedSearch, "i");

        filter.$or = [
            { title: regex },
            { location: regex },
            { country: regex },
        ];
    }

    const allListings = await Listing.find(filter);
    res.render("listings/index", {
        allListings,
        category: category || null,
        search: search || "",
    });
};

// Helper — prevents regex injection / ReDoS attacks
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

    res.render("listings/show",{listing,mapToken: process.env.MAP_TOKEN});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req,res,next)=>{
    //let {title ,description ,image,price,country,location} = req.body;
    if (!req.file) {
        req.flash("error", "Please upload an image.");
        return res.redirect("/listings/new");
    }
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
        })
        .send()

        const url = req.file.path;
        const filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url , filename};
        newListing.geometry = response.body.features[0].geometry;
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
    
    let originalImageUrl = listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/upload","/upload/h_300/w_250");
    res.render("listings/edit",{listing,originalImageUrl});
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}
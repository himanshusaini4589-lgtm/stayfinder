module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log("Saving:", req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }

    next();
};

module.exports.validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);

    if(result.error){
        let errMsg = result.error.details
            .map((el)=>el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
}

module.exports.validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);

    if(result.error){
        let errMsg = result.error.details
            .map((el)=>el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
}
module.exports.saveRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        console.log("Session:", req.session.redirectUrl);
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
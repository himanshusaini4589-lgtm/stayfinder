 const express = require("express");
 const app = express();
 const path = require("path");
 const mongoose = require("mongoose");
 const Listing = require("./models/listing.js");
 const ejsmate = require('ejs-mate');
 const methodOverride = require("method-override");
 const wrapAsync = require("./utils/wrapAsync.js");
 const ExpressError = require("./utils/ExpressError.js")
 const { listingSchema } = require("./schema.js");
 const port = 8080;
 const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
 const Review = require("./models/review.js");

main()
.then(()=>{
    console.log("connection to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("hi,I am Root");
})

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
app.get("/Listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}));

app.get("/listings/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs",); 
}));

app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    //let {title ,description ,image,price,country,location} = req.body;
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    
}));

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${id}`);
    
}));

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    
    const listing = await Listing.findById(id);
    if(!listing){
        throw new ExpressError(404,"Listing you requested does not exist");
    }
    res.render("listings/show.ejs",{listing});
    
}));

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

//post Reviews
app.post("/listings/:id/reviews",wrapAsync(async (req,res)=>{
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


app.all("/*splat",(req,res,next)=>{
    
    next(new ExpressError(404,"Page not Found!"));
})
app.use((err,req,res,next) =>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{
        err
    });
});
 app.listen(port,()=>{
    console.log(`you are listening from port no : ${port}`);
 })
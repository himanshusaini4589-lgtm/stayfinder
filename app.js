 const express = require("express");
 const app = express();
 const path = require("path");
 const mongoose = require("mongoose");
 const ejsmate = require('ejs-mate');
 const methodOverride = require("method-override");
 const ExpressError = require("./utils/ExpressError.js")

 const port = 8080;
 const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

 const listings = require("./routes/listing.js");
 const reviews = require("./routes/review.js");

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


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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
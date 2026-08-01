if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
 const app = express();
 const path = require("path");
 const mongoose = require("mongoose");
 const ejsmate = require('ejs-mate');
 const methodOverride = require("method-override");
 const ExpressError = require("./utils/ExpressError.js")

 const port = 8080;
 const dburl = process.env.ATLASDB_URL;

 const listingRouter = require("./routes/listing.js");
 const reviewRouter = require("./routes/review.js");
 const userRouter = require("./routes/user.js");
 const User = require("./models/user.js");
 const session = require("express-session");
 const MongoStore = require('connect-mongo');
 console.log("MongoStore =", MongoStore);

console.log("Keys =", Object.keys(MongoStore));

process.exit(0);

 const flash = require("connect-flash");

 const passport = require("passport");
 const LocalStrategy = require("passport-local");

console.log(process.env.ATLASDB_URL);
main()
.then(()=>{
    console.log("connection to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl : dburl,
    touchAfter : 24*60*60,
    crypto : {
        secret : process.env.SECRET_KEY
    }
});

store.on("error",function(e){
    console.log("session store error",e);
})
const sessionOptions = {
    store : store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly : true
    },
}

app.get("/",(req,res)=>{
    res.send("hi,I am Root");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//pbkdf2 hashing algorithm 
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

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
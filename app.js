 const express = require("express");
 const app = express();
 const mongoose = require("mongoose");
 const Listing = require("./models/listing.js");
const port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

app.get("/",(req,res)=>{
    res.send("hi,I am Root");
})

app.get("/testlisting",async (req,res)=>{
    let sampleListing = new Listing({
        title : "My Home",
        description : "By The Beach",
        price: 1200,
        location : "calangute,goa",
        country : "India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("succesful testing");
});

 app.listen(port,()=>{
    console.log(`you are listening from port no : ${port}`);
 })
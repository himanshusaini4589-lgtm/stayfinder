if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = process.env.ATLASDB_URL;

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

const initDB = async () => {
    await Listing.deleteMany({});

    for (let obj of initData.data) {
        const response = await geocodingClient
            .forwardGeocode({ query: obj.location, limit: 1 })
            .send();

        obj.geometry = response.body.features[0].geometry;
        obj.owner = "6a6d92f6fab0207959640ceb";
    }

    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
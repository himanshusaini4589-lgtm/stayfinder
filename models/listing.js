const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1769921546096-...",
        },
        filename: {
            type: String,
            default: "listingimage",
        },
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ]
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
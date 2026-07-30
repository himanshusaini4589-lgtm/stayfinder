const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});
const { isLoggedIn , validateListing, isOwner} = require("../middleware");
const listingController = require("../controllers/listings");


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createNewListing));


router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editFormRender));

router.route("/:id")
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.editListing)
)
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
module.exports = router;


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin, validateListing, isOwner } = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudComfig.js")
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedIn, isAdmin, upload.single('listing[image]'), validateListing, wrapAsync(listingcontroller.createroute));

//search route
router.get("/search", wrapAsync(listingcontroller.searchListings));

//suggestions route
router.get("/suggestions", wrapAsync(listingcontroller.getSuggestions));

//filter route
router.get("/filter", isLoggedIn, wrapAsync(listingcontroller.filterListings));

//new route
router.get("/new", isLoggedIn, isAdmin, listingcontroller.rendernewform);


router.route("/:id")
    .get(isLoggedIn, wrapAsync(listingcontroller.showlisting))
    .put(isLoggedIn, isAdmin, isOwner, upload.single('listing[Image]'), validateListing, wrapAsync(listingcontroller.updateroute))
    .delete(isLoggedIn, isAdmin, isOwner, wrapAsync(listingcontroller.deleteroute));


//edit route
router.get("/:id/edit", isLoggedIn, isAdmin, isOwner, wrapAsync(listingcontroller.renderEditroute));


module.exports = router;

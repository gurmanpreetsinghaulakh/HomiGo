const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const usercontroller= require("../controllers/user.js");
const listingcontroller = require("../controllers/listings.js");



router.route("/signup")
  .get(usercontroller.rendersignupform)
  .post(wrapAsync(usercontroller.signup));

router.post("/signup/verify", wrapAsync(usercontroller.verifySignupOtp));
router.post("/signup/resend", wrapAsync(usercontroller.resendSignupOtp));

router.route("/login")
.get(usercontroller.renderloginform)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),usercontroller.login);


//logout  
router.get("/logout", usercontroller.logout);

// User specific data
router.get("/user/bookings", isLoggedIn, wrapAsync(listingcontroller.getMyBookings));

module.exports = router;

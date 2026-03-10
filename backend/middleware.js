const listing = require("./models/listing.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");

const Review = require("./models/review.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    console.log("User not authenticated, saving URL:", req.originalUrl);
    return res.status(401).json({ success: false, error: "You must be logged in" });
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, error: "Access denied. Admins only." });
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  console.log("Saving redirect URL, session has:", req.session.redirectUrl);

  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("Moved to res.locals:", res.locals.redirectUrl);
    delete req.session.redirectUrl; // Clear the redirect URL after saving it
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing1 = await listing.findById(id);
  if (!listing1.owner.equals(req.user._id)) {
    return res.status(403).json({ success: false, error: "You are not the owner of this listing" });
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(result);

  if (error) {
    let errorm = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorm);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  // console.log(result);

  if (error) {
    let errorm = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorm);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  let listing1 = await Review.findById(reviewid);
  if (!listing1.author.equals(res.locals.currUser._id)) {
    return res.status(403).json({ success: false, error: "You did not create this review" });
  }
  next();
};
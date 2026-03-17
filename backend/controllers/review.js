const Review = require("../models/review.js");
const listing = require("../models/listing.js");
module.exports.addnewreview = async (req, res, next) => {
  let listings = await listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);

  listings.reviews.push(newReview);
  await newReview.save();
  await listings.save();
  console.log("new review saved");
  res.status(201).json({ success: true, message: "New Review Added !!!", review: newReview });
}


module.exports.deleteroute = async (req, res) => {
  let { id, reviewid } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  res.json({ success: true, message: "Review Deleted !!!" });
}
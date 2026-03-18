const listing = require("../models/listing");
const Booking = require("../models/booking");



module.exports.index = async (req, res) => {
  const listings = await listing.find({});
  res.json({ success: true, listings });
};

module.exports.searchListings = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    return res.status(400).json({ success: false, error: "Please enter a search term" });
  }

  // Search in title, location, country, and description using case-insensitive regex
  const listings = await listing.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
      { country: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ]
  });

  if (listings.length === 0) {
    return res.json({ success: true, listings: [], message: `No listings found for "${q}"` });
  }

  res.json({ success: true, listings });
};

module.exports.getSuggestions = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    return res.json([]);
  }

  try {
    const query = q.trim();

    // Search for listings matching the query
    const listings = await listing.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } }
      ]
    }).limit(5);

    // Extract unique suggestions from titles, locations, and countries
    const suggestions = new Set();

    listings.forEach(list => {
      if (list.title) suggestions.add(list.title);
      if (list.location) suggestions.add(list.location);
      if (list.country) suggestions.add(list.country);
    });

    // Return as array, limited to 5 suggestions
    const result = Array.from(suggestions).slice(0, 5);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

module.exports.filterListings = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ success: false, error: "Category not provided" });
  }

  // Define keywords for each category
  const categoryKeywords = {
    "Trending": ["popular", "trending", "luxury", "exclusive", "modern"],
    "Rooms": ["room", "bedroom", "suite", "apartment", "studio"],
    "Iconic Cities": ["city", "urban", "downtown", "metro", "metropolitan", "new york", "paris", "london", "tokyo", "dubai"],
    "Castles": ["castle", "palace", "manor", "estate", "historic", "fortress"],
    "Amazing pools": ["pool", "swimming", "poolside", "infinity pool", "heated pool"],
    "Farms": ["farm", "ranch", "countryside", "rural", "barn", "farmhouse", "agricultural"],
    "Arctic": ["arctic", "snow", "winter", "ski", "mountain", "cold", "alpine", "northern"],
    "Treehouses": ["treehouse", "tree house", "forest", "canopy", "woods", "treetop"],
    "Beachfront": ["beach", "beachfront", "ocean", "sea", "coastal", "seaside", "waterfront", "shore"]
  };

  const keywords = categoryKeywords[category];
  if (!keywords) {
    return res.status(400).json({ success: false, error: "Invalid category" });
  }

  // Search for listings matching any of the keywords
  const listings = await listing.find({
    $or: keywords.map(keyword => ({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } }
      ]
    }))
  });

  if (listings.length === 0) {
    return res.json({ success: true, listings: [], message: `No listings found in ${category} category` });
  }

  res.json({ success: true, listings, selectedCategory: category });
};

module.exports.rendernewform = (req, res) => { res.json({ success: true, message: "Render new form" }); };

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  const listings = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listings) {
    return res.status(404).json({ success: false, error: "Listing you requested for does not exist" });
  }
  //   console.log("listings", listings);
  res.json({ success: true, listings });
};

module.exports.createroute = async (req, res, next) => {
  const newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;

  if (req.files && req.files.length > 0) {
    const uploadedImages = req.files.map(f => ({
      url: f.path && f.path.startsWith('http') ? f.path : `/uploads/${f.filename}`,
      filename: f.filename
    }));
    newlisting.Image = uploadedImages[0];
    newlisting.images = uploadedImages;
  } else if (req.file) {
    const filename = req.file.filename;
    const url = req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/${filename}`;
    newlisting.Image = { url, filename };
    newlisting.images = [{ url, filename }];
  } else {
    return res.status(400).json({ success: false, error: "At least 1 image is required" });
  }

  // Set default geometry since it's required by the model
  newlisting.geometry = {
    type: "Point",
    coordinates: [0, 0] // Default fallback or use location data if available.
  };

  try {
    const savedlis = await newlisting.save();
    res.status(201).json({ success: true, message: "New Listing Created !!!", listing: savedlis });
  } catch (err) {
    console.error("Save listing error:", err);
    res.status(500).json({ success: false, error: "Database error while saving listing" });
  }
};

module.exports.renderEditroute = async (req, res) => {
  let { id } = req.params;
  const listings = await listing.findById(id);
  if (!listings) {
    return res.status(404).json({ success: false, error: "Listing you requested for does not exist" });
  }
  let originalImageUrl = listings.Image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250")
  res.json({ success: true, listings, originalImageUrl });
};

module.exports.updateroute = async (req, res) => {
  let { id } = req.params;
  
  // Update the basic fields first and get the refreshed document
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
  
  if (!Listing) {
    return res.status(404).json({ success: false, error: "Listing not found" });
  }

  // Handle multiple file uploads if present
  if (req.files && req.files.length > 0) {
    const uploadedImages = req.files.map(f => ({
      url: f.path && f.path.startsWith('http') ? f.path : `/uploads/${f.filename}`,
      filename: f.filename
    }));
    
    Listing.Image = uploadedImages[0];
    Listing.images = uploadedImages;
    await Listing.save();
  } 
  // Handle single file upload if present (though route mostly uses .array now)
  else if (req.file) {
    const filename = req.file.filename;
    const url = req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/${filename}`;
    
    Listing.Image = { url, filename };
    Listing.images = [{ url, filename }];
    await Listing.save();
  }

  res.json({ success: true, message: "Listing Updated Successfully!", listing: Listing });
};

module.exports.deleteroute = async (req, res) => {
  let { id } = req.params;

  let deleted = await listing.findByIdAndDelete(id);
  console.log(deleted);
  res.json({ success: true, message: "Listing Deleted !!!", deleted });
};

module.exports.bookListing = async (req, res) => {
  let { id } = req.params;
  const { nights, amount } = req.body;
  const listingToBook = await listing.findById(id);
  
  if (!listingToBook) {
    return res.status(404).json({ success: false, error: "Listing not found" });
  }

  if (listingToBook.availableRooms <= 0) {
    return res.status(400).json({ success: false, error: "No rooms available" });
  }

  // Record the booking
  const newBooking = new Booking({
    listing: listingToBook._id,
    user: req.user._id,
    nights: nights || 1,
    amount: amount || (listingToBook.price * (nights || 1)),
    status: 'pending'
  });

  await newBooking.save();

  // Decrement room availability
  listingToBook.availableRooms -= 1;
  await listingToBook.save();

  res.json({ success: true, message: "Booking successful", availableRooms: listingToBook.availableRooms, booking: newBooking });
};

module.exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('listing')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, bookings });
};

module.exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find({})
    .populate('listing')
    .populate('user')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, bookings });
};

module.exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  
  if (!updatedBooking) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }
  
  res.json({ success: true, booking: updatedBooking });
};

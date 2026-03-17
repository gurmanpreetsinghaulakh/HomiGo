const listing = require("../models/listing");



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
  if (!req.file) {
    return res.status(400).json({ success: false, error: "Image is required" });
  }

  const filename = req.file.filename;
  const url = req.file.path && req.file.path.startsWith('http')
    ? req.file.path
    : `/uploads/${filename}`;

  const newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.Image = { url, filename };

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
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof (req.file) !== "undefined") {
    const filename = req.file.filename;
    const url = req.file.path && req.file.path.startsWith('http')
      ? req.file.path
      : `/uploads/${filename}`;

    Listing.Image = { url, filename };
    await Listing.save();
  }
  res.json({ success: true, message: "Listing Updated !!!", listing: Listing });
};

module.exports.deleteroute = async (req, res) => {
  let { id } = req.params;

  let deleted = await listing.findByIdAndDelete(id);
  console.log(deleted);
  res.json({ success: true, message: "Listing Deleted !!!", deleted });
};

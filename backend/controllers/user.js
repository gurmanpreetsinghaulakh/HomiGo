const passport = require("passport");
const User = require("../models/user.js");

module.exports.rendersignupform = (req, res) => {
  res.json({ success: true, message: "Render signup form" });
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ email, username });
    const registeredUser = await User.register(newuser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ success: true, message: "Welcome to HomiGo", user: registeredUser });
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};


module.exports.renderloginform = (req, res) => {
  // Only save referrer if there's no existing redirectUrl in session
  // (to prioritize protected route redirects over referrer)
  if (
    !req.session.redirectUrl &&
    req.get("Referrer") &&
    !req.get("Referrer").includes("/login")
  ) {
    req.session.redirectUrl = req.get("Referrer");
  }
  res.json({ success: true, message: "Render login form", redirectUrl: req.session.redirectUrl });
};



module.exports.login = async (req, res) => {
  let RedirectUrl = req.user?.isAdmin ? "/admin-dashboard" : "/dashboard";
  if (res.locals.redirectUrl) {
    RedirectUrl = res.locals.redirectUrl;
    console.log("Redirecting to saved URL:", RedirectUrl);
  } else {
    console.log("No saved URL, redirecting to default:", RedirectUrl);
  }
  // Explicitly include isAdmin so the React client can route correctly
  const userPayload = {
    _id: req.user?._id,
    username: req.user?.username,
    email: req.user?.email,
    isAdmin: req.user?.isAdmin || false,
  };
  res.json({ success: true, message: "Welcome to HomiGo", RedirectUrl, user: userPayload });
};


module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ success: true, message: "You are logged out!" });
  });
};

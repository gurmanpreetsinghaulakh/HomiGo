const passport = require("passport");
const User = require("../models/user.js");

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME || "HomiGo";
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || "no-reply@homigo.com";

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

async function sendOtpEmail(toEmail, otp) {
  if (!BREVO_API_KEY) {
    throw new Error("Brevo API key is not configured (BREVO_API_KEY)");
  }

  // Debug helper: ensure key is being read correctly
  console.log("[Brevo] key length:", BREVO_API_KEY.length, "first8:", BREVO_API_KEY.slice(0, 8));

  const payload = {
    sender: { name: BREVO_FROM_NAME, email: BREVO_FROM_EMAIL },
    to: [{ email: toEmail }],
    subject: "Your HomiGo verification code",
    htmlContent: `<html><body><h2 style="font-family: sans-serif;">Verify your HomiGo account</h2><p>Your verification code is:</p><p style="font-size: 2rem; font-weight: 700; letter-spacing: 0.15em;">${otp}</p><p>This code expires in <strong>1 minute</strong>.</p></body></html>`,
  };

  // If API key is not configured, log OTP instead of sending email (useful for local dev).
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY not set; OTP for", toEmail, "is", otp);
    return;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[Brevo] send failed", res.status, res.statusText, body);
    if (res.status === 401) {
      throw new Error("Brevo API key is invalid or expired. Please update BREVO_API_KEY in .env.");
    }
    throw new Error(`Brevo send failed: ${res.status} ${res.statusText} ${body}`);
  }
}

module.exports.rendersignupform = (req, res) => {
  res.json({ success: true, message: "Render signup form" });
};

const clearPendingSignup = (req) => {
  req.session.pendingSignup = null;
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "Username, email and password are required." });
    }

    // Prevent creating duplicate accounts
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: "An account with this email already exists." });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 60 * 1000; // 1 minute

    // Save pending signup info in session until OTP is verified
    req.session.pendingSignup = {
      username,
      email,
      password,
      otp,
      expiresAt,
      attempts: 0,
    };

    await sendOtpEmail(email, otp);

    res.status(200).json({ success: true, message: "OTP sent to your email.", expiresIn: 60 });
  } catch (e) {
    console.error("Signup OTP error:", e);
    res.status(400).json({ success: false, error: e.message });
  }
};

module.exports.verifySignupOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const pending = req.session.pendingSignup;

    if (!pending) {
      return res.status(400).json({ success: false, error: "No pending signup found. Please start over." });
    }

    const now = Date.now();
    if (now > pending.expiresAt) {
      clearPendingSignup(req);
      return res.status(400).json({ success: false, error: "OTP expired. Please request a new code." });
    }

    pending.attempts = (pending.attempts || 0) + 1;

    if (otp !== pending.otp) {
      return res.status(400).json({ success: false, error: "Incorrect OTP. Please try again." });
    }

    // OTP is correct - create the user
    const newuser = new User({ email: pending.email, username: pending.username });
    const registeredUser = await User.register(newuser, pending.password);

    // Clear pending data and log the user in
    clearPendingSignup(req);

    req.login(registeredUser, (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: "Login failed after verification." });
      }
      res.status(201).json({ success: true, message: "Account created.", user: registeredUser });
    });
  } catch (e) {
    console.error("OTP verification error:", e);
    res.status(400).json({ success: false, error: e.message });
  }
};

module.exports.resendSignupOtp = async (req, res) => {
  try {
    const pending = req.session.pendingSignup;

    if (!pending) {
      return res.status(400).json({ success: false, error: "No pending signup found. Please sign up first." });
    }

    const otp = generateOtp();
    pending.otp = otp;
    pending.expiresAt = Date.now() + 60 * 1000;
    pending.attempts = 0;

    await sendOtpEmail(pending.email, otp);

    res.status(200).json({ success: true, message: "A new OTP was sent.", expiresIn: 60 });
  } catch (e) {
    console.error("Resend OTP error:", e);
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

const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const auth = (req, res, next) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.redirect("/"); // Redirect to the home page if no cookie
  } else {
    const userTok = cookie.split("=");

    if (userTok.length === 2) {
      const token = userTok[1];

      try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user; // Attach user data to request
        next(); // Proceed to the next middleware or route
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } else {
      console.log("Token not found");
      return res.status(401).json({ message: "Token not found" });
    }
  }
};

module.exports = { auth };

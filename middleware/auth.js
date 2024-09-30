// middleware/auth.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "renaoisbest@genius";

const auth = (req, res, next) => {
  const cookie = req.headers.cookie;
  if (!cookie) {
    return res.sendFile(path.join(__dirname, "../public", "index.html"));
  } else {
    const userTok = cookie.split("=");

    if (userTok.length === 2) {
      const token = userTok[1];

      try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user;
        next();
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

import jwt from "jsonwebtoken";
import User from '../models/Users.js'
// const secretKey = "00"; // put in .env in real apps

// const  authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });

//     req.user = user; // save user data for routes
//     next();
//   });
// }
const secretKey = "00"
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, secretKey, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    // Check sessionId matches DB
    const user = await User.findById(payload['_id']);
    if (!user || user.session !== payload.session) {
      return res.status(401).json({ message: "Session expired" });
    }
    req.user = payload;
    next();
  });
}


export async function authenticateWsConnection(req) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, secretKey);

    const user = await User.findById(payload["_id"]);
    if (!user || user.session !== payload.session) {
      return null;
    }

    return payload; // attach user info if valid
  } catch (err) {
    return null;
  }
}
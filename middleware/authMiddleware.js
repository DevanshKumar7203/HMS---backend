import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
console.log("COOKIES:", req.cookies);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECERT);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

  
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};



//ROLE AUTHORIZATION
export const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not allowed`,
      });
    }

    next();
  };
};
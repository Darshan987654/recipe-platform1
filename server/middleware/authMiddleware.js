import jwt from "jsonwebtoken"
import { asyncHandler } from "./asyncHandler.js"
import User from "../models/User.js"

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token

  // Get token from cookies
  if (req.cookies.token) {
    token = req.cookies.token
  }
  // Get token from header
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  // Make sure token exists
  if (!token) {
    res.status(401)
    throw new Error("Not authorized to access this route")
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Set user to req.user
    req.user = await User.findById(decoded.id).select("-password")

    next()
  } catch (error) {
    res.status(401)
    throw new Error("Not authorized to access this route")
  }
})


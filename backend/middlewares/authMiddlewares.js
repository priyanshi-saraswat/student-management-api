const jwt = require("jsonwebtoken");

// 1) Authenticate Access Token
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format. Expected 'Bearer <token>'"
      });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    // Returned 401 for expired or invalid authentication tokens
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message
    });
  }
};

// 2) Role-Based Access Control (RBAC)
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to perform this action."
      });
    }
    next();
  };
};


// const accessToken=generateAccessToken(user);
// const refreshToken=generateRefreshToken(user);

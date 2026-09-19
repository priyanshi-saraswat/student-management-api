const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "5m" }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };


// +post/api/auth/login=>get accesstokne+refrehtoken
  // =>   wait for access token to get expires=> post/api/auth/refresh with("refreshToken....")=>  response:{accesstoken:new_access_token}


// const express = require("express");
// const { register, login } = require("../controllers/authController");
// const { authenticate } = require("../middlewares/authMiddlewares");

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// // Protected Route
// router.get("/profile", authenticate, (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "You have accessed a protected route!",
//     user: req.user
//   });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const authController=require("../controllers/authController");
const { register, login, refreshToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh',refreshToken);
router.post("/logout",authController.logout);

module.exports = router;
const express = require("express"); // Fixed 'required' typo
const router = express.Router();
const { createCourse } = require("../controllers/CourseController");

router.post("/", createCourse);

module.exports = router;

// const{
//     createUser
// }=require('../controller/CourseController');

// const routeCounts = {};

// router.use((req, res, next) => {
//   const path = req.path;
//   routeCounts[path] = (routeCounts[path] || 0) + 1;
//   console.log(`[Hit Count] ${req.method} ${path}: ${routeCounts[path]}`);
//   next();
// });
// router.post("/course",createUser);

// // 
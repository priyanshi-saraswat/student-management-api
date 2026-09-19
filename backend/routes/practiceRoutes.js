// const express = require('express');
// const router = express.Router();
// const { authenticate } = require("../middlewares/authMiddlewares");

// const {
//   createStudent,
//   loginUser,
//   getStudentsOver21,
//   getMjstudents,
//   getstudentsStartWithA,
//   getstudentsBycourse,
//   studentAvgAgeByCourse,
//   getstudentSortByAge,
//   getSortstudentByAge,
//   createIndexOnEmail,
//   ExplainEmailQuery
// } = require('../controllers/practiceController');

// // Route hit counter middleware
// const routeCounts = {};

// router.use((req, res, next) => {
//   const path = req.path;
//   routeCounts[path] = (routeCounts[path] || 0) + 1;
//   console.log(`[Hit Count] ${req.method} ${path}: ${routeCounts[path]}`);
//   next();
// });

// router.post('/students', createStudent);
// router.post('/students/login', loginUser);
// router.get('/students/over-21', authenticate, getStudentsOver21);
// router.get('/students/mj', getMjstudents);
// router.get('/students/start-with-a', getstudentsStartWithA);
// router.get('/students/by-course', getstudentsBycourse);
// router.get('/students/avg-age', studentAvgAgeByCourse);
// router.get('/students/sort-age', getstudentSortByAge);
// router.get('/students/order-age', getSortstudentByAge);
// router.post('/students/index-email', createIndexOnEmail);
// router.get('/students/explain-email', ExplainEmailQuery);

// router.get('/students/route-counts', (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: routeCounts
//   });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddlewares");

const {
  createStudent,
  getStudentsOver21,
  getMjstudents,
  getstudentsStartWithA,
  getstudentsBycourse,
  studentAvgAgeByCourse,
  getstudentSortByAge,
  getSortstudentByAge,
  createIndexOnEmail,
  ExplainEmailQuery
} = require('../controllers/practiceController');

// Route hit counter middleware
const routeCounts = {};

router.use((req, res, next) => {
  const path = req.path;
  routeCounts[path] = (routeCounts[path] || 0) + 1;
  console.log(`[Hit Count] ${req.method} ${path}: ${routeCounts[path]}`);
  next();
});

// Student Data Routes
router.post('/students', createStudent);

// Protected Route (Requires Access Token)
router.get('/students/over-21', authenticate, getStudentsOver21);

// Public / Utility Routes
router.get('/students/mj', getMjstudents);
router.get('/students/start-with-a', getstudentsStartWithA);
router.get('/students/by-course', getstudentsBycourse);
router.get('/students/avg-age', studentAvgAgeByCourse);
router.get('/students/sort-age', getstudentSortByAge);
router.get('/students/order-age', getSortstudentByAge);
router.post('/students/index-email', createIndexOnEmail);
router.get('/students/explain-email', ExplainEmailQuery);

router.get('/students/route-counts', (req, res) => {
  res.status(200).json({
    success: true,
    data: routeCounts
  });
});

module.exports = router;
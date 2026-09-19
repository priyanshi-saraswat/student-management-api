// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');

// require('dotenv').config({ path: path.join(__dirname, '../.env') });

// const practiceRoute = require('../routes/practiceRoutes');
// const authRoute = require('../routes/authRoute');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Body Parser Middleware
// app.use(express.json());

// // Routes (Specific routes first)
// app.use('/api/auth', authRoute);
// app.use('/api', practiceRoute);

// // Root Health Route
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "welcome to the practice api"
//   });
// });

// // 404 Route Handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "route not found"
//   });
// });

// // Database Connection
// const ConnectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`Mongodb connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`error connecting to mongodb: ${error.message}`);
//     process.exit(1);
//   }
// };

// ConnectDB();

// app.listen(PORT, () => {
//   console.log(`server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });
// Route Imports
const practiceRoute = require('../routes/practiceRoutes');
const authRoute = require('../routes/authRoute');
const courseRoute = require('../routes/courseRoute');
const userRoute = require('../routes/userRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Body Parser Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/courses', courseRoute);
app.use('/api/users', userRoute);
app.use('/api', practiceRoute);

// Root Health Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'welcome to the practice api'
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'route not found'
  });
});

// Database Connection
const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`error connecting to mongodb: ${error.message}`);
    process.exit(1);
  }
};

ConnectDB();

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

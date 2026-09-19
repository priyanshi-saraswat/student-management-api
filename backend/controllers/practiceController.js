const Practice = require('../models/practiceModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1) Create a new student with hashed password
exports.createStudent = async (req, res) => {
  try {
    const { name, age, course, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Practice({
      name,
      age,
      course,
      email,
      password: hashedPassword
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Failed',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// 2) Login student (Authentication)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const student = await Practice.findOne({ email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const accessToken = jwt.sign(
      { userId: student._id.toString(), email: student.email },
      process.env.JWT_SECRET || 'fallbackSecretKey',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successfully',
      accessToken,
      data: {
        id: student._id,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// 3) Get students older than 21
exports.getStudentsOver21 = async (req, res) => {
  try {
    const students = await Practice.find({ age: { $gt: 21 } });
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No student found'
      });
    }
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 4) Get MERN or Java students
exports.getMjstudents = async (req, res) => {
  try {
    const students = await Practice.find({ course: { $in: ['mern', 'java'] } });
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No student found'
      });
    }
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 5) Get students starting with letter 'A'
exports.getstudentsStartWithA = async (req, res) => {
  try {
    const students = await Practice.find({ name: { $regex: '^A', $options: 'i' } });
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 6) Group and sort student count by course
exports.getstudentsBycourse = async (req, res) => {
  try {
    const students = await Practice.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: 1 }
      }
    ]);
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: 'No students found'
      });
    }
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 7) Calculate average age by course
exports.studentAvgAgeByCourse = async (req, res) => {
  try {
    const students = await Practice.aggregate([
      {
        $group: {
          _id: '$course',
          AverageAge: { $avg: '$age' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { AverageAge: -1 }
      }
    ]);
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 8) Sort students by age ascending
exports.getstudentSortByAge = async (req, res) => {
  try {
    const students = await Practice.find().sort({ age: 1 });
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: 'No students'
      });
    }
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 9) Dynamic sorting by query parameter (asc / desc)
exports.getSortstudentByAge = async (req, res) => {
  try {
    const order = req.query.order || 'asc';
    let sortOrder;

    if (order === 'asc') {
      sortOrder = 1;
    } else if (order === 'desc') {
      sortOrder = -1;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid order. Use 'asc' or 'desc'."
      });
    }

    const sortestudents = await Practice.find().sort({ age: sortOrder });

    if (!sortestudents.length) {
      return res.status(404).json({
        success: false,
        message: 'No student found'
      });
    }

    res.status(200).json({
      success: true,
      count: sortestudents.length,
      data: sortestudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 10) Create Index on Email
exports.createIndexOnEmail = async (req, res) => {
  try {
    await Practice.collection.createIndex({ email: 1 }, { unique: true });

    res.status(200).json({
      success: true,
      message: 'Email index created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 11) Query explanation for execution stats
exports.ExplainEmailQuery = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email query parameter is required'
      });
    }

    const explanation = await Practice.find({ email }).explain('executionStats');

    res.status(200).json({
      success: true,
      query: { email },
      explanation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
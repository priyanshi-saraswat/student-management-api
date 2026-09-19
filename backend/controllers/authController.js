// // jsonwebtoken=>   we dont want the client to send email + password  with every 
// // headers => payload => signature  (three parts ,separated by dots)
// // xxxxxx.yyyyyy.zzzzzz=>role is placed in middle.

// // const jwt=require("jsonwebtoken");
// // email and pass=req.body:
// // check =>all fields are req=>
// //     find the email vala person if find
// // bcrypt .compare 
// const User=require("..")
// const bcrypt=require("bcrypt");
// const jwt=require("jsonwebtoken")

// const login= async (req,res)=>{
//     try{
//         const {email,pasword}=req.body;
//         const User=Practice.findOne({email});
//         if(!email||!password){
//             return res.status(400).json({
//                 success:false,
//                 message:"required all fields email and password"
//             })
//         }
//         const PasswordMatch=await bcrypt.compare(password.User.password);
//         if(!PasswordMatch){
//             return res.status(401).json({
//                 success:false,
//                 message:"invalid password"
//             })
//         }
//         const accessToken= jwt.sign(
//             {userId:user.id.toString(),role:user.role},
//             process.env.JWT_SECRET,
//             {expiresIn:"1d"}
//         );
//         res.status(200).json({
//             success:true,
//             message:"login successful",
//             accessToken,
//             user:{
//                 id:user.id,
//                 name:user.name,
//                 email:user.email,
//                 role:user.role
//             }
//         })
//     }catch(err){
//         return res.status(500).json({
//             success:false,
//             error:error.message,
//             message:"internal server error"
//         });
//     }
// }
// module.exports={register,login};

// const User = require("../models/UserModel"); // Adjust this path to match your actual model file location
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body; // Fixed typo: pasword -> password

//         // 1. Check if fields are provided first
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Required all fields email and password"
//             });
//         }

//         // 2. Find the user in the database (added await and proper model variable)
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//         }

//         // 3. Compare the raw password with the hashed password stored in the DB
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid password"
//             });
//         }

//         // 4. Generate the JWT access token
//         const accessToken = jwt.sign(
//             { userId: user._id.toString(), role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" }
//         );

//         // 5. Send success response
//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             accessToken,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });

//     } catch (error) { // Fixed error variable reference
//         return res.status(500).json({
//             success: false,
//             error: error.message,
//             message: "Internal server error"
//         });
//     }
// };

// module.exports = { login };

const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // UserModel pre-save hook handles hashing automatically
    const newUser = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate Access Token (15s) and Refresh Token (7d)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Refresh Access Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify the Refresh Token signature using your refresh secret
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired refresh token'
        });
      }

      // Generate a new 15-second Access Token using decoded user payload
      const newAccessToken = generateAccessToken({
        _id: decoded.userId,
        role: decoded.role
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// LOGOUT
exports.logout= async (req,res)=>{
  try{
    const{refreshToken}=req.body;
    return res.status(200).json({
      success:true,
      message:"logged out successfully"
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"server error during logout",
      error:error.message
    });
  }
};
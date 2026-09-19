// const mongooose=require("mongoose");
// const bcrypt=require("bcrypt");

// const UserSchema=new mongoose.Schema({
//     name:{type:String,required:true,minLength:2,maxLength:30,trim:true},
//     email:{type:String,required:true,unique:true,trime:true,lowercase:true},
//     password:{type:String,required:true,minLenght:6},
//     role:{type:String,required:true,enum:["student","admin"],default:"student"
// },
// },{
//     timestamps:true
// }
// )
// UserSchema.pre("save",async function (next) {
//     if(!this.isModified("password")){
//         return next();
//     }
//     try{
//         this.password=await bcrypt.hash(this.password,10);
//         next();
//     }catch(error){
//         next(error);
//     }
// })
// const User=mongoose.model("User",userSchema);
// module.exports=User;

// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true, minLength: 2, maxLength: 30, trim: true },
//     email: { type: String, required: true, unique: true, trim: true, lowercase: true }, // Fixed trime -> trim
//     password: { type: String, required: true, minLength: 6 }, // Fixed minLenght -> minLength
//     role: { type: String, required: true, enum: ["student", "admin"], default: "student" }
// }, {
//     timestamps: true
// });

// UserSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         return next();
//     }
//     try {
//         this.password = await bcrypt.hash(this.password, 10);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// const User = mongoose.model("User", UserSchema); // Fixed userSchema -> UserSchema
// module.exports = User;

// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const UserSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, minlength: 2, maxlength: 50 },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true, minlength: 6 },
//     role: { type: String, required: true, enum: ["student", "teacher", "admin"], default: "student" }
//   },
//   {
//     timestamps: true
//   }
// );

// // Automatic password hashing before save
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   try {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// const User = mongoose.model("User", UserSchema);

// module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

// Pre-save hook for password hashing
userSchema.pre('save', async function () {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
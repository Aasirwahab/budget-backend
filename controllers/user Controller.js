const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');

// Register (already exists, no change needed)
const registerController =async (req,res) =>{
  try{
      const {name,email,password} =req.body
      //validation
      if(!name){
          return res.status(400).send({
              success:false,
              message:"name is required"
          });
      }
      if(!email){
          return res.status(400).send({
              success:false,
              message:"email is required"
          });
      } if(!password ||password.length <6){
          return res.status(400).send({
              success:false,
              message:"password is required and 6 character long"
          });
      }
      //existing user
      const existingUser = await userModel.findOne({email})
      if(existingUser){
          return res.status(500).send({
              success:false,
              message: "UserAlready Register with This Email"
          });
      }
      
       //hashed pasword
  const hashedPassword = await hashPassword(password);

      //save user
      const user = await userModel({
          name,
          email,
          password:hashedPassword,
      }).save();

      res.status(201).send({
           success:false,
           message:"Registeration Sucessfull please login"
      });
  }catch(error){
      console.log(error)
      return res.status(500).send({
          success:false,
          message:"Error in Register API",
          error,
      });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({ success: false, message: "Please provide email and password" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({ success: false, message: "User not found" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({ success: false, message: "Invalid username or password" });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("Generated Token:", token); // Debugging log

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).send({ 
      success: true, 
      message: "Login successful", 
      user, 
      token // Include the token in the response
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error in login API", error });
  }
};

const userController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
const logoutController = (req, res) => {
  res.clearCookie('authToken');
  res.status(200).send({ success: true, message: 'Logout successful' });
};

module.exports = { registerController, loginController, userController, logoutController }
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    //validation
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    //rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    // Handle validation errors
    /*if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      return res.status(400).send({
        success: false,
        message: "Validation errors",
        errors: errors,
      });
    }*/
    res.status(500).send({
      success: false,
      message: "Error in register API",
      error: error,
    });
  }
};

//login call back
const loginController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({
      email: req.body.email,
    });
    if (!exisitingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    //check roles
    if (exisitingUser.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "Invalid role",
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      exisitingUser.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Password is incorrect",
      });
    }
    const token = jwt.sign(
      { userId: exisitingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).send({
      success: true,
      message: "Login Successfully",
      token: token,
      user: exisitingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

//GET CURRENT USER
const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

module.exports = { registerController, loginController, currentUserController };

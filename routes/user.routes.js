const express = require("express");
const userrouter = express.Router();
const {
  registerUsercontroller,
  verifyemailcontroler,
  loginController,
  logout,
  uploadUserAvtar,
  updateUserDetails,
  forgotpassword,
  verifyForgotpassotp,
  resetpasssword,
} = require("../controllers/user.controllers");
const { auth } = require("../middleware/auth");

userrouter.post("/register", registerUsercontroller);
userrouter.post("/verify-email", verifyemailcontroler);
userrouter.post("/login", loginController);
userrouter.get("/logout", auth, logout);
userrouter.put("/uploaddisplaypicture", auth, uploadUserAvtar);
userrouter.put("/update-user", auth, updateUserDetails);
userrouter.put("/forgotpassword", forgotpassword);
userrouter.put("/verify-forgot-password-otp", verifyForgotpassotp);
userrouter.put("/reset-password", resetpasssword);
module.exports = userrouter;

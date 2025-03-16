const mailSender = require("../config/sendmail.js");
const Usermodel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const verifyAccountTemplate = require("../mailtemplate/accountcreation.js");
const { generateaccesstoken } = require("../utils/generateAccesstoken.js");
const {
  uploadImageToCloudinary,
} = require("../utils/uploadimagecloudinary.js");
const { generateotp } = require("../utils/generateOtp.js");
const userModel = require("../models/user.model");
const { forgotPassword } = require("../mailtemplate/forgotpasswordtemplate.js");
exports.registerUsercontroller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "provide email,name,password",
        error: true,
        success: false,
      });
    }

    const user = await Usermodel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "already register email",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashpassword,
    };

    const newuser = new Usermodel(payload);
    const save = await newuser.save();
    const verifyemailurl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;
    console.log(verifyemailurl);
    const sendmail = await mailSender({
      email: "vandanrangani21@gmail.com",
      subject: "verify email from blinkit ",
      html: verifyAccountTemplate({ name, verificationLink: verifyemailurl }),
    });
    return res.status(200).json({
      message: "user resgister succesfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

exports.verifyemailcontroler = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await Usermodel.findOne({ _id: code });
    if (!user) {
      return res.status(200).json({
        message: "invalid code",
        success: false,
      });
    }
    const updateuser = await Usermodel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return res.json({
      message: "email verify has been done",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "error",
      success: false,
      error: err,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "all fields are required",
        success: false,
        error: true,
      });
    }

    const user = await Usermodel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
        error: true,
      });
    }

    if (user.status.toLocaleLowerCase() !== "active") {
      return res.status(400).json({
        message: "contact to admin",
        success: false,
        error: true,
      });
    }

    const checkpassword = await bcryptjs.compare(password, user.password);
    if (!checkpassword) {
      return res.status(400).json({
        message: "Check your password",
        success: false,
        error: true,
      });
    }

    const accesstoken = await generateaccesstoken(user._id);
    const cookieoption = {
      http: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
    res.cookie("accessToken", accesstoken, cookieoption);
    return res.status(200).json({
      message: "logged in succesfully",
      success: true,
      data: {
        accesstoken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: true,
      success: false,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const cookieoption = {
      http: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookieoption);

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

exports.uploadUserAvtar = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.userId;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    // console.log(image);
    const updatedProfile = await Usermodel.findByIdAndUpdate(
      { _id: userId },
      { avatar: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, password, mobile } = req.body;
    let hashpassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashpassword = await bcryptjs.hash(password, salt);
    }
    const updateUser = await Usermodel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashpassword }),
      }
    );
    return res.status(200).json({
      message: "updated user succesfully",
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide a valid email",
        success: false,
      });
    }

    const checkemail = await Usermodel.findOne({ email });
    if (!checkemail) {
      // Respond with a generic message to prevent email enumeration
      return res.status(200).json({
        message:
          "If this email is registered, check your inbox for further instructions.",
        success: true,
      });
    }

    const otp = generateotp();
    const expireTime = Date.now() + 60 * 1000; // 1 hour from now

    await Usermodel.findByIdAndUpdate(checkemail._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: expireTime,
    });

    try {
      await mailSender({
        to: email,
        subject: "Forgot Password",
        html: forgotPassword(checkemail.name, otp),
      });
    } catch (mailError) {
      console.error("Error sending email:", mailError.message);
      return res.status(500).json({
        message: "Failed to send email. Please try again later.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "otp sended succesfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in forgot password:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.verifyForgotpassotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check for missing fields
    if (!email || !otp) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // Find user by email
    const user = await Usermodel.findOne({ email });
    if (!user) {
      // Respond with a generic message to avoid email enumeration
      return res.status(200).json({
        message:
          "If this email is registered, check your inbox for further instructions.",
        success: true,
      });
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (new Date(user.forgot_password_expiry) < currentTime) {
      return res.status(400).json({
        message: "OTP has expired.",
        success: false,
      });
    }

    // Check if OTP is valid
    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
        success: false,
      });
    }

    // OTP is valid and not expired
    return res.status(200).json({
      message: "OTP verified successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "An unexpected error occurred.",
      success: false,
    });
  }
};

exports.resetpasssword = async (req, res) => {
  try {
    const { email, newpass, confirmpass } = req.body;

    if (!email || !newpass || !confirmpass) {
      // Respond with a generic message to prevent email enumeration
      return res.status(400).json({
        message: "all fields are required",
        success: false,
      });
    }
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "email is not available",
        success: false,
      });
    }
    if (newpass !== confirmpass) {
      return res.status(400).json({
        message: "both the passowrd are not same ",
        success: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(confirmpass, salt);
    const update = await Usermodel.findByIdAndUpdate(user._id, {
      password: hashpassword,
    });
    return res.status(200).json({
      message: "password update succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

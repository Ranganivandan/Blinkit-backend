const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587, // Ensure the correct port is specified
      secure: false, // Use true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    let info = await transporter.sendMail({
      from: `"Blinkit" <vandanrangani21@gmail.com>`,
      to: email,
      subject: title,
      html: body,
    });
    if (!info) {
      throw new Error("Failed to send email, info is null or undefined");
    }
    console.log(info);
    return info;
  } catch (error) {
    console.log("Error occurred while sending email:", error.message);
    return null; // Return null or handle the error as needed
  }
};

module.exports = mailSender;

const dotenv = require("dotenv");
dotenv.config();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const connectDB = require("./config/db.connect");
const userrouter = require("./routes/user.routes");
const { cloudinaryConnect } = require("./config/cloudinary");
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResoursePolicy: false,
  })
);
const PORT = 8080 || process.env.PORT;
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
cloudinaryConnect();
app.get("/", (req, res) => {
  res.send("your server in up");
});
app.use("/api/user", userrouter);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});

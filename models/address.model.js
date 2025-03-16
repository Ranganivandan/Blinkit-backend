const mongoose = require("mongoose");
const { stringify } = require("querystring");
const addressSchema = new mongoose.Schema(
  {
    address_line: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
module, (exports = mongoose.model("address", addressSchema));

const mongoose = require("mongoose");
const { type } = require("os");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: [true, "Please provide a user ID"],
  },
  orderID: {
    type: String,
    unique: true,
    required: [true, "provide orderId"],
  },
  product_details: {
    name: String,
    image: Array,
  },
  productId: {
    type: mongoose.type.ObjectId,
    ref: "product",
  },
  paymentStatus: {
    type: String,
    // enum: ["pending", "paid", "failed"],
    default: "",
  },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
  delivery_address: {
    type: String,
    ref: "address",
    required: [true, "Please provide a shipping address"],
  },
  subTotalAmt: {
    type: Number,
    default: 0,
  },
  TotalAmt: {
    type: Number,
    default: 0,
  },
  invoice_receipt: {
    type: String,
    default: "  ",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

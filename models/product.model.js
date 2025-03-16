const mongoose = require("mongoose");
const { type } = require("os");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
  },
  image: {
    type: Array,
    default: [],
  },
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  ],
  subCategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "subCategory",
    },
  ],
  unit: {
    type: String,
    default: "",
    required: [true, "Please provide a unit"],
  },
  stock: {
    type: Number,
    default: 0,
    required: [true, "Please provide stock information"],
    min: [0, "Stock cannot be negative"],
  },
  price: {
    type: Number,
    default: null,
    required: [true, "Please provide a price"],
    min: [0, "Price cannot be negative"],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
  },
  description: {
    type: String,
    default: "",
  },
  more_details: {
    type: Object,
    default: {},
  },
  publish: {
    type: Boolean,
    default: true,
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

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

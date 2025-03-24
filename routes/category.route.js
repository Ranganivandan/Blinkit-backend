const express = require("express");
const categoryrouter = express.Router();
const { auth } = require("../middleware/auth");
const {
  AddcategoryController,
} = require("../controllers/category.controllers");

categoryrouter.post("/add-category", auth, AddcategoryController);
module.exports = categoryrouter;

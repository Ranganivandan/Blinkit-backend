import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const Categorymodel = require("../models/category.model");
export const AddcategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.json({
        message: "enter required field",
        error: true,
        success: false,
      });
    }
    const addCategory = new Categorymodel({
      name,
      image,
    });
    const savecategory = await addCategory.save();
    if (!savecategory) {
      return res.status(500).json({
        message: "Not created",
        error: true,
        success: false,
      });
    }
    return res.json({
      message: "add catrgory",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};

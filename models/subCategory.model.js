const { default: mongoose } = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a sub-category name"],
  },
  image: {
    type: String,
    default: null,
  },
  categoryId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;

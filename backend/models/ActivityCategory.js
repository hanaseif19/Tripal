const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activityCategorySchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const ActivityCategory = mongoose.model("ActivityCategory", activityCategorySchema);
module.exports = ActivityCategory;
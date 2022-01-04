const mongoose = require("mongoose");

const PickupsSchema = new mongoose.Schema(
  {
    point: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickups", PickupsSchema);

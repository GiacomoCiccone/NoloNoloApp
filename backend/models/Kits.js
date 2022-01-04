const mongoose = require("mongoose");

const KitsSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kits", KitsSchema);

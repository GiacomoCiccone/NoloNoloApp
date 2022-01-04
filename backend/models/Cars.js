const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    images: {
      type: Array,
      required: true,
    },
    //nome del modello di auto
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    condition: {
      //perfect | good | weak
      type: String,
      required: true,
    },
    unavaiable: {
      from: Date,
      to: Date,
    },
    //dove risiede la macchina
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pickups",
      required: true
    },
    tags: [String],
    //descrizione dell'auto
    description: {
      type: String,
      required: true,
    },
    //sedili
    seats: {
      type: Number,
      required: true,
    },
    hasAutomaticTransmission: {
      type: Boolean,
      required: true
    },
    hasThreeDoors: {
      type: Boolean,
      required: true
    },
    baggageSize: {
      type: String, //small | medium | big
      required: true
    },
    isElectric: {
      type: Boolean,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cars", CarSchema);

const mongoose = require("mongoose");

const RentsSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    rentObj: {
      car: { type: mongoose.Schema.Types.ObjectId, ref: "Cars" },
      kits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rents' }]
    },
    //stato del noleggio. pending | accepted | concluded | expired
    state: {
      type: String,
      default: "pending",
    },

    type: String, //period | classic
    
    classic: {
      from: Date,
      to: Date,
    },

    period: {
      from: Number,
      to: Number,
      since: Date,
      for: Number,
      singleDay: Boolean
    },
    adminActions: [
      {
        date: Date,
        message: String,
        admin: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
      },
    ],
    price: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rents", RentsSchema);

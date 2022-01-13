const mongoose = require("mongoose");

const RentsSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    rentObj: {
      car: { type: mongoose.Schema.Types.ObjectId, ref: "Cars" },
      kits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kits' }]
    },
    //stato del noleggio. pending | accepted | concluded
    state: {
      type: String,
      default: "pending",
    },

    concludedAt: Date,  //data conclusione

    type: String, //period | classic
    
    classic: {
      from: Date,
      to: Date,
    },

    isLate: Boolean,  //true se e' in ritardo

    address: {  //indirizzo di fatturazione dell utente === indirizzo dell'utente al momento del noleggio
      city: String,
      via: String,
      postal_code: Number,
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

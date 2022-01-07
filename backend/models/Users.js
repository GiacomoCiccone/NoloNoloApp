const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Per favore fornisci un Username"],
    },
    email: {
      type: String,
      required: [true, "Per favore fornisci una mail"],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Per favore fornisci una mail valida",
      ],
    },
    password: {
      type: String,
      required: [true, "Per favore fornisci una password"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "La password deve contenere una lettera maiuscola, una minuscola, un numero, un carattere non alfanumerico e deve essere lunga almeno otto caratteri",
      ],
      //non vogliamo che la password sia mandata quando richiediamo un user
      select: false,
    },
    first_name: {
      type: String,
      required: [true, "Per favore fornisci un nome"]
    },
    last_name: {
      type: String,
      required: [true, "Per favore fornisci un cognome"]
    },
    role: { type: String, default: "user" }, //user | admin | manager
    address: {
      city: String,
      via: String,
      postal_code: Number,
    },
    birth: {
      type: Date,
      required: [true, "Per favore fornisci una data di nascita"]
    },
    gender: {
      type: String,
      required: [true, "Per favore fornisci informazioni sul genere"]
    },
    //preferenze
    preferences: [String],  //sportiva - elegante - famiglia - viaggio
    //commenti aggiunti da admin
    comments: {
      type: Array,
      select: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

//middleware eseguito prima di salvare il documento nel database.
UserSchema.pre("save", async function (next) {
  //se la password non viene modificata salta, altrimenti la salva con hash e salt
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  //aggiungiamo il sale alla password
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  //in questo caso si modifica l'azione non il documento
  if (!this.getUpdate().$set.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  //aggiungiamo il sale alla password
  this.getUpdate().$set.password = await bcrypt.hash(
    this.getUpdate().$set.password,
    salt
  );
  return next();
});

//metodo per questo mdoello per verificare se le password combaciano
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//il token contiene i dati dell'utente e scade in un certo tempo definito in .env
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //setta il campo resetPasswordToken di questo utente
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //10 minuti
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  //ritorniamo la versione non hashata
  return resetToken;
};

module.exports = mongoose.model("Users", UserSchema);

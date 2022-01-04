const express = require("express");
//permette di creare percorsi di route modulari
var router = express.Router();
const { protect } = require("../middleware/auth");
const Users = require("../models/Users");
const ErrorResponse = require("../utils/errorResponse");

//CRUD

//create non serve perche' c'e' register

//read all
router.route("/").get(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      //ritorna l'user updato
      let user = await Users.find({disabled: false}).select("+comments");;
      res.status(200).json({ success: true, data: {
        userInfo: user._doc
      }});
    } catch (error) {
      next(error);
    }
  }
}); //da proteggere

//read by id
router.route("/:id").get(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      let user = await Users.findById(req.params.id,).select("+comments");;
      res.status(200).json({ success: true, data: {
        userInfo: user._doc
      }});
    } catch (error) {
      next(error);
    }
  }
}); //da proteggere

//read by username
router.route("/username/:username").get(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      let user = await Users.findOne({username: req.params.username}).select("+comments");
      res.status(200).json({ success: true, data: {
        userInfo: user._doc
      }});
    } catch (error) {
      next(error);
    }
  }
}); //da proteggere


//update
router.route("/:id").put(protect, async (req, res, next) => {
  if (req.userInfo._id == req.params.id || req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      //ritorna l'user updato
      let updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, useFindAndModify: false }
      );
      res.status(200).json({ success: true, userInfo: updatedUser._doc });
    } catch (error) {
      next(error);
    }
  } else {
    return next(new ErrorResponse("Puoi modificare solo il tuo account", 403));
  }
});

//delete
router.route("/:id").delete(protect, async (req, res, next) => {
  if (req.userInfo._id == req.params.id || req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      //cerchiamo tutti i rent relativi a tale utente
      const history = Rents.find({'customer': mongoose.Schema.Types.ObjectId(req.params.id)})

      if (history.length > 0) { //elimina solo se non ha rent effettuati, altrimenti si disattiva l'account
        await Users.findByIdAndDelete(req.params.id);
      } else {
        await Users.findByIdAndUpdate({$set: {disabled: true, email: "disabled", username: "disabled"}})
      }
      
      res.status(200).json({ success: true, data: "Utente eliminato con successo" });
    } catch (error) {
      next(error);
    }
  } else {
    return next(new ErrorResponse("Puoi modificare solo il tuo account", 403));
  }
}); //da proteggere

//others

//statistiche
module.exports = router;

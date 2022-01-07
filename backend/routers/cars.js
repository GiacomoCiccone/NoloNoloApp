const express = require("express");
//permette di creare percorsi di route modulari
var router = express.Router();
const { protect } = require("../middleware/auth");
const checkAvaiability = require("../utils/CheckAvaiability");
const ErrorResponse = require("../utils/errorResponse");
const Cars = require("../models/Cars");
const Rents = require("../models/Rents")
const mongoose = require("mongoose");

//CRUD

//create
router.route("/").post(async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      const car = new Cars({
        ...req.body.car,
      });

      await car.save();

      res
        .status(201)
        .json({ success: true, data: "Auto inserita con successo" });
    } catch (error) {
      return next(error);
    }
  } else {
    return next(new ErrorResponse("Non autorizzato", 403));
  }
});

//read all
router.route("/").get(async (req, res, next) => {
  let dateRange;
  //si stanno filtrando le auto per vederne la disponibilita'
  req.query.checkAvaiability
    ? req.query.type === "period"
      ? (dateRange = {
          type: "period",
          period: {
            from: req.query.from,
            to: req.query.to,
            for: req.query.for,
            since: req.query.since,
            singleDay: req.query.from === req.query.to,
          },
        })
      : (dateRange = {
          type: "classic",
          classic: {
            from: req.query.from,
            to: req.query.to,
          },
        })
    : false;
  try {
    let data = await Cars.find().populate("place")

    if (data.length > 0 && req.query.checkAvaiability) {
      
      let avaiableCar = []

      for (let i = 0; i < data.length; i++) {
        const car = data[i];
        //cerchiamo tutti i rent relativi a tale macchina
        const history = Rents.find({'rentObj.car': mongoose.Types.ObjectId(car._id)})
        
        //vede se e' disponibile per le date
        if (history.length > 0 && !checkAvaiability(history, car, dateRange) && car.place === req.query.place) {
          avaiableCar.push(car);
        }
      }
      data = avaiableCar;
    }

    if (data.length > 0) {

      res.status(200).json({ success: true, data: data });

    } else {
      return next(new ErrorResponse("Nessuna corrispondenza trovata", 404));
    }
  } catch (error) {
    return next(error);
  }
});

//read all
router.route("/place/:id").get(async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      const data = await Cars.find({  place: req.params.id }).populate("place")

      if (!data) {
        return next(new ErrorResponse("Nessuna corrispondenza trovata", 404));
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      return next(error);
    }
  } else {
    return next(new ErrorResponse("Non autorizzato", 403));
  }
});

//read
router.route("/:id").get(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      const data = await Cars.findOne({ _id: req.params.id }).populate("place")

      if (!data) {
        return next(new ErrorResponse("Modello di auto non trovato", 404));
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      return next(error);
    }
  } else {
    return next(new ErrorResponse("Non autorizzato", 403));
  }
});

//update
router.route("/:id").put(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      const carUpdated = await Cars.findByIdAndUpdate(req.params.id, req.body);

      if (!carUpdated) {
        return next(new ErrorResponse("Modello di auto non trovato", 404));
      }

      res.status(200).json({ success: true, data: carUpdated });
    } catch (error) {
      return next(error);
    }
  } else {
    return next(new ErrorResponse("Non autorizzato", 403));
  }
});

//delete
router.route("/:id").delete(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      const carToDelete = await Cars.findOne({ _id: req.params.id }).populate("place")

      if (!carToDelete) {
        return next(new ErrorResponse("Modello di auto non trovato", 404));
      }

      const history = Rents.find({'rentObj.car': mongoose.Types.ObjectId(req.params.id)})

      //se e' stata noleggiata almeno una volta si rende non disponibile
      if (history.length > 0) {
        const minDate = new Date(-8640000000000000);
        carToDelete.unavaiable.from = minDate;
        await carToDelete.save();
        res.status(200).json({ success: true, data: `Auto resa non disponibile da ${minDate.toLocaleString("it-IT")}` });
      } else {
        await Cars.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true, data: "Auto eliminata con successo" });
      }
      
    } catch (error) {
      return next(error);
    }
  } else {
    return next(new ErrorResponse("Non autorizzato", 403));
  }
});

//others

//statistiche

module.exports = router;

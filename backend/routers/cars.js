const express = require("express");
//permette di creare percorsi di route modulari
var router = express.Router();
const { protect } = require("../middleware/auth");
const { checkAvailability } = require("../utils/CheckAvaiability");
const ErrorResponse = require("../utils/errorResponse");
const Cars = require("../models/Cars");
const Rents = require("../models/Rents")
const mongoose = require("mongoose");

//CRUD

//create
router.route("/").post(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      const car = new Cars({
        ...req.body,
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

/**
 * Se nella query si passa checkAvaiability controlla anche la disponibilita'.
 * Se nella query si passa place si cercano le auto in quel posto.
 * type indica il tipo di "noleggio" che si sta cercando ed e' o classic  o period.
 * Se e' classic allora bisogna specificare anche from (data di inizio con orario) sia un to (data di fine con orario).
 * Se e' period bisogna specificare in from il numero del giorno della settimana di inizio, to quello di fine, for il numero di settimane totali (da 1 a 54) since la data di inizio (dalla mezzanotte).
 */
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

  let query = {}
  req.query.place ? query.place = req.query.place : query = {}
  try {
    let data = await Cars.find(query).populate("place")

    if (data.length > 0 && req.query.checkAvaiability) {
      let avaiableCar = []

      for (let i = 0; i < data.length; i++) {
        const car = data[i];
        //cerchiamo tutti i rent relativi a tale macchina
        const history = await Rents.find({'rentObj.car': mongoose.Types.ObjectId(car._id)})

        //vede se e' disponibile per le date
        if (history.length > 0 && checkAvailability(history, car, dateRange)) {
          avaiableCar.push(car);
          //se non ha noleggi va bene sempre
        } else if (history.length === 0) {
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

//se si cercano le auto per posto si puo' usare questa passando l'id del posto
router.route("/place/:id").get(protect, async (req, res, next) => {
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

//read id auto
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

//update id auto
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

//delete id auto
router.route("/:id").delete(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
    try {
      const carToDelete = await Cars.findOne({ _id: req.params.id }).populate("place")

      if (!carToDelete) {
        return next(new ErrorResponse("Modello di auto non trovato", 404));
      }

      const history = await Rents.find({'rentObj.car': mongoose.Types.ObjectId(req.params.id)})

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

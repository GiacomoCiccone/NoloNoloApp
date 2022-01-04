const express = require("express");
//permette di creare percorsi di route modulari
var router = express.Router();
const { protect } = require("../middleware/auth");
const Kits = require("../models/Kits");
const ErrorResponse = require("../utils/errorResponse");

//CRUD

//create
router.route("/").post(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
  try {
    const kit = new Kits({...req.body});

    await kit.save();

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
} else {
  return next(new ErrorResponse("Non autorizzato", 403));
}
});

//read all
router.route("/").get(async (req, res, next) => {
  try {
    const data = await Kits.find({});
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    next(error);
  }
});

//read
router.route("/:id").get(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
  try {
    const kit = Kits.findById(req.params.id);

    if (!kit) {
        return next(new ErrorResponse("Kit non trovato", 404))
    }

    res.status(201).json({ success: true, data: kit });
  } catch (error) {
    next(error);
  }
} else {
  return next(new ErrorResponse("Non autorizzato", 403));
}
});

//read
router.route("/name/:name").get(protect, async (req, res, next) => {
    try {
      const kit = Kits.findOne({name: req.params.name});
  
      if (!kit) {
          return next(new ErrorResponse("Kit non trovato", 404))
      }
  
      res.status(201).json({ success: true, data: kit });
    } catch (error) {
      next(error);
    }
  });

//update
router.route("/:id").put(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
  try {
    const kitUpdated = Kits.findByIdAndUpdate(req.params.id, req.body);

    if (!kitUpdated) {
        return next(new ErrorResponse("Kit non trovato", 404))
    }

    res.status(201).json({ success: true, data: kitUpdated });
  } catch (error) {
    next(error);
  }
} else {
  return next(new ErrorResponse("Non autorizzato", 403));
}
});

//delete
router.route("/:id").delete(protect, async (req, res, next) => {
  if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
  //da proteggere
  try {
    const deleted = await Kits.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new ErrorResponse("Punto di ritiro non trovato", 404));
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
} else {
  return next(new ErrorResponse("Non autorizzato", 403));
}
});

//others

//statistiche

module.exports = router;
const express = require("express");
//permette di creare percorsi di route modulari
var router = express.Router();
const { protect } = require("../middleware/auth");
const ErrorResponse = require("../utils/errorResponse");
const Rents = require("../models/Rents");
const Cars = require("../models/Cars")
const calcPrice = require("../utils/calcPrice")

//CRUD

//create
router.route("/").post(async (req, res, next) => {
    try {
        const rent = new Rents({
            ...req.body,
            price: calcPrice(req.body, req.body.rent.rentObj.car, false)
        });

        await rent.save();

        res.status(201).json({
            success: true,
            message: "Nuovo noleggio inserito con successo",
        });
    } catch (error) {
        return next(error);
    }
});

//read all
router.route("/").get(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            const rents = Rents.find()
            .populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            })

            res.status(200).json({success: true, data: rents})
        } catch (error) {
            return next(new ErrorResponse(error))
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//read
router.route("/:id").get(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            const rent = Rents.findById(req.params.id)
            .populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            })

            if (!rent) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404))
            }

            res.status(200).json({success: true, data: rent})
        } catch (error) {
            return next(new ErrorResponse(error))
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//read by user
router.route("/users/:id").get(protect, async (req, res, next) => {
    if (req.userInfo._id == req.params.id || req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            const rents = Rents.find({customer: req.params.id})
            .populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            })

            if (rents.length === 0) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404))
            }

            res.status(200).json({success: true, data: rents})
        } catch (error) {
            return next(new ErrorResponse(error))
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//read by car
router.route("/cars/:id").get(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            const rents = Rents.find({"rentObj.car": req.params.id})
            .populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            })

            if (rents.length === 0) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404))
            }

            res.status(200).json({success: true, data: rents})
        } catch (error) {
            return next(new ErrorResponse(error))
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//update
router.route("/:id").put(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            let changeState = req.query.changeState;
            const rentToUpdate = Rents.findById(req.params.id)
            .populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            })

            if (!rentToUpdate) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404))
            } else {
                if (rentToUpdate.type === "period") {
                    if (rentToUpdate.state !== "concluded" && (rentToUpdate.period.since > new Date() || changeState)) {    //si modifica solo se non e' finito e o non e' ancora iniziato o se si sta cambiando lo stato
                        rentToUpdate = await Rents.findByIdAndUpdate(req.params.id, { $set: req.body },
                            { new: true, runValidators: true, useFindAndModify: false });
                        rentoToUpdate.price = calcPrice(rentoToUpdate, rentToUpdate.rentObj.car, false); //ogni modifica viene ricalcolato il prezzo
                        await rentToUpdate.save();
                    } else {
                        return next(new ErrorResponse("Non si può eliminare un noleggio già iniziato", 400))
                    }
                } else {
                    if (rentToUpdate.state !== "concluded" && (rentToUpdate.classic.from > new Date() || changeState)) { //si modifica solo se non e' ancora iniziato o se si sta cambiando lo stato
                        rentToUpdate = await Rents.findByIdAndUpdate(req.params.id, { $set: req.body },
                            { new: true, runValidators: true, useFindAndModify: false });
                            rentoToUpdate.price = calcPrice(rentoToUpdate, rentToUpdate.rentObj.car, false);   //ogni modifica viene ricalcolato il prezzo
                            await rentToUpdate.save();
                    } else {
                        return next(new ErrorResponse("Non si può eliminare un noleggio già iniziato", 400))
                    }
                }
            }

            res.status(200).json({success: true, data: rentToUpdate})

            
        } catch (error) {
            return next(new ErrorResponse(error))
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//delete
router.route("/:id").delete(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            const rentToDelete = Rents.findById(req.params.id)

            if (!rentToDelete) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404))
            } else {
                if (rentToDelete.type === "period") {
                    if (rentToDelete.period.since > new Date()) {
                        await Rents.findByIdAndDelete(req.params.id);
                    } else {
                        return next(new ErrorResponse("Non si può eliminare un noleggio già iniziato", 400))
                    }
                } else {
                    if (rentToDelete.classic.from > new Date()) {
                        await Rents.findByIdAndDelete(req.params.id);
                    } else {
                        return next(new ErrorResponse("Non si può eliminare un noleggio già iniziato", 400))
                    }
                }
            }

            res.status(200).json({success: true, data: "Noleggio eliminato"})
        } catch (error) {
            return next(new ErrorResponse(error))
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//get price of model id
router.route("/getPrice/:id").get(async (req, res, next) => {
    try {
        if (!req.query) return next(new ErrorResponse("Richiesta non corretta", 400))
        else {
            let rent = {};
            if (req.query.type === "period") {
                rent.type = "period"
                rent.period = {
                    from: parseInt(req.query.from),
                    to: parseInt(req.query.to),
                    for: parseInt(req.query.for),
                    since: new Date(new Date(req.query.since).setHours(0,0,0,0)),
                    singleDay: req.query.from === req.query.to,
                }
            } else {
                rent.type = "classic";
                rent.classic = {
                    from: new Date(req.query.from),
                    to: new Date(req.query.to),
                }
            }
            rent.rentObj = {}
            rent.rentObj.kits = req.query.kits.split(";").map(kit => {return {price: parseInt(kit)}})

            const car = await Cars.findById(req.params.id);

            if (!car) return next(new ErrorResponse("Auto non trovata", 404))

            let info = calcPrice(rent, car, true)

            res.status(200).json({success: true, data: info});
        }
    } catch (error) {
        return next(error);
    }
});

//others

module.exports = router;

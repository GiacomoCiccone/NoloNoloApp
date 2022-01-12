const express = require("express");
//permette di creare percorsi di route modulari
var router = express.Router();
const { protect } = require("../middleware/auth");
const ErrorResponse = require("../utils/errorResponse");
const Rents = require("../models/Rents");
const Cars = require("../models/Cars");
const Kits = require("../models/Kits");
const calcPrice = require("../utils/calcPrice");
const { checkAvailability } = require("../utils/CheckAvaiability");
const mongoose = require("mongoose");

//CRUD

//create
router.route("/").post(protect, async (req, res, next) => {
    try {
        //macchina che stiamo per noleggiare
        const car = await Cars.findById(req.body.rentObj.car);
        if (!car) return next(new ErrorResponse("Richiesta non valida", 400));

        //cerchiamo tutti i rent relativi a tale macchina
        const history = await Rents.find({
            "rentObj.car": mongoose.Types.ObjectId(car._id),
        });

        //costruiamo l'oggetto che contiene le informazioni sulle date del noleggio
        let dateRange;

        if (req.body.type === "period") {
            dateRange = {
                type: "period",
                period: {
                    from: req.body.period.from,
                    to: req.body.period.to,
                    for: req.body.period.for,
                    since: req.body.period.since,
                    singleDay: req.body.period.from === req.body.period.to,
                },
            };
        } else {
            dateRange = {
                type: "classic",
                classic: {
                    from: req.body.classic.from,
                    to: req.body.classic.to,
                },
            };
        }

        //controlla se la macchina è disponibile
        if (history.length > 0 && !checkAvailability(history, car, dateRange))
            return next(
                new ErrorResponse(
                    "Macchina non disponibile nelle date scelte",
                    404
                )
            );

        let expandedKits = [];
        //bisogna prendere le info sui kit per calcolare il prezzo
        if (req.body.rentObj.kits && req.body.rentObj.kits.length > 0) {
            for (var i = 0; i < req.body.rentObj.kits.length; i++) {
                let kit = req.body.rentObj.kits[i];
                const kitExpanded = await Kits.findById(kit);
                if (!kitExpanded)
                    return next(new ErrorResponse("Kit non trovato", 404));
                expandedKits.push(kitExpanded);
            }
        }

        //lui ha le informazioni sui kit (prezzo ecc) e puo' usarle per calcPrice
        let expandedKitsBody = {};
        if (req.body.type === "period") {
            expandedKitsBody.type = "period";
            expandedKitsBody.period = {
                from: parseInt(req.body.period.from),
                to: parseInt(req.body.period.to),
                for: parseInt(req.body.period.for),
                since: new Date(req.body.period.since),
                singleDay: req.body.period.from === req.body.period.to,
            };
        } else {
            expandedKitsBody.type = "classic";
            expandedKitsBody.classic = {
                from: new Date(req.body.classic.from),
                to: new Date(req.body.classic.to),
            };
        }
        expandedKitsBody.rentObj = {};
        expandedKitsBody.rentObj.kits = expandedKits;

        //crea il noleggio col prezzo
        const rent = new Rents({
            ...req.body,
            price: calcPrice(expandedKitsBody, car, false),
        });

        await rent.save();

        res.status(201).json({
            success: true,
            data: "Nuovo noleggio inserito con successo",
        });
    } catch (error) {
        return next(error);
    }
});

//read all
router.route("/").get(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            const rents = await Rents.find()
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                });

            res.status(200).json({ success: true, data: rents });
        } catch (error) {
            return next(new ErrorResponse(error));
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//read
router.route("/:id").get(protect, async (req, res, next) => {
    try {
        const rent = await Rents.findById(req.params.id)
            .populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            });
            
        if (!rent) {
            return next(new ErrorResponse("Nessun noleggio trovato", 404));
        }

        res.status(200).json({ success: true, data: rent });
    } catch (error) {
        return next(new ErrorResponse(error));
    }
});

//read by user
router.route("/users/:id").get(protect, async (req, res, next) => {
    if (
        req.userInfo._id == req.params.id ||
        (req.userInfo.role === "admin" && req.userInfo.role === "manager")
    ) {
        try {
            const rents = await Rents.find({ customer: req.params.id })
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                });

            if (rents.length === 0) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404));
            }

            res.status(200).json({ success: true, data: rents });
        } catch (error) {
            return next(new ErrorResponse(error));
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//read by car
router.route("/cars/:id").get(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            const rents = await Rents.find({ "rentObj.car": req.params.id })
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                });

            if (rents.length === 0) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404));
            }

            res.status(200).json({ success: true, data: rents });
        } catch (error) {
            return next(new ErrorResponse(error));
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
            const rentToUpdate = await Rents.findById(req.params.id)
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                });

            if (!rentToUpdate) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404));
            } else {
                if (rentToUpdate.type === "period") {
                    if (
                        rentToUpdate.state !== "concluded" &&
                        (rentToUpdate.period.since > new Date() || changeState)
                    ) {
                        //si modifica solo se non e' finito e o non e' ancora iniziato o se si sta cambiando lo stato
                        rentToUpdate = await Rents.findByIdAndUpdate(
                            req.params.id,
                            { $set: req.body },
                            {
                                new: true,
                                runValidators: true,
                                useFindAndModify: false,
                            }
                        );
                        rentoToUpdate.price = calcPrice(
                            rentoToUpdate,
                            rentToUpdate.rentObj.car,
                            false
                        ); //ogni modifica viene ricalcolato il prezzo
                        await rentToUpdate.save();
                    } else {
                        return next(
                            new ErrorResponse(
                                "Non si può eliminare un noleggio già iniziato",
                                400
                            )
                        );
                    }
                } else {
                    if (
                        rentToUpdate.state !== "concluded" &&
                        (rentToUpdate.classic.from > new Date() || changeState)
                    ) {
                        //si modifica solo se non e' ancora iniziato o se si sta cambiando lo stato
                        rentToUpdate = await Rents.findByIdAndUpdate(
                            req.params.id,
                            { $set: req.body },
                            {
                                new: true,
                                runValidators: true,
                                useFindAndModify: false,
                            }
                        );
                        rentoToUpdate.price = calcPrice(
                            rentoToUpdate,
                            rentToUpdate.rentObj.car,
                            false
                        ); //ogni modifica viene ricalcolato il prezzo
                        await rentToUpdate.save();
                    } else {
                        return next(
                            new ErrorResponse(
                                "Non si può eliminare un noleggio già iniziato",
                                400
                            )
                        );
                    }
                }
            }

            res.status(200).json({ success: true, data: rentToUpdate });
        } catch (error) {
            return next(new ErrorResponse(error));
        }
    } else {
            //prendiamo il rent da updatare
            const rentToUpdate = await Rents.findById(req.params.id);

            if (rentToUpdate.customer === String(req.userInfo._id)) {
                return next(new ErrorResponse("Non autorizzato", 403))
            } 

            //altrimenti procediamo come con la creazione
            try {
                //macchina che stiamo per noleggiare
                const car = await Cars.findById(req.body.rentObj.car);
                if (!car) return next(new ErrorResponse("Richiesta non valida", 400));
        
                //cerchiamo tutti i rent relativi a tale macchina
                const history = await Rents.find({
                    "rentObj.car": mongoose.Types.ObjectId(car._id),
                });
        
                //costruiamo l'oggetto che contiene le informazioni sulle date del noleggio
                let dateRange;
        
                if (req.body.type === "period") {

                    //noleggio iniziato
                    if (rentToUpdate.period.since <= new Date()) return next(new ErrorResponse("Impossibile modificare un noleggio già iniziato.", 400))

                    dateRange = {
                        type: "period",
                        period: {
                            from: req.body.period.from,
                            to: req.body.period.to,
                            for: req.body.period.for,
                            since: req.body.period.since,
                            singleDay: req.body.period.from === req.body.period.to,
                        },
                    };
                } else {

                    //noleggio iniziato
                    if (rentToUpdate.classic.from <= new Date()) return next(new ErrorResponse("Impossibile modificare un noleggio già iniziato.", 400))
                    dateRange = {
                        type: "classic",
                        classic: {
                            from: req.body.classic.from,
                            to: req.body.classic.to,
                        },
                    };
                }

                dateRange.id = rentToUpdate._id
        
                //controlla se la macchina è disponibile
                if (history.length > 0 && !checkAvailability(history, car, dateRange))
                    return next(
                        new ErrorResponse(
                            "Macchina non disponibile nelle date scelte",
                            404
                        )
                    );
        
                let expandedKits = [];
                //bisogna prendere le info sui kit per calcolare il prezzo
                if (req.body.rentObj.kits && req.body.rentObj.kits.length > 0) {
                    for (var i = 0; i < req.body.rentObj.kits.length; i++) {
                        let kit = req.body.rentObj.kits[i];
                        const kitExpanded = await Kits.findById(kit);
                        if (!kitExpanded)
                            return next(new ErrorResponse("Kit non trovato", 404));
                        expandedKits.push(kitExpanded);
                    }
                }
        
                //lui ha le informazioni sui kit (prezzo ecc) e puo' usarle per calcPrice
                let expandedKitsBody = {};
                if (req.body.type === "period") {
                    expandedKitsBody.type = "period";
                    expandedKitsBody.period = {
                        from: parseInt(req.body.period.from),
                        to: parseInt(req.body.period.to),
                        for: parseInt(req.body.period.for),
                        since: new Date(req.body.period.since),
                        singleDay: req.body.period.from === req.body.period.to,
                    };
                } else {
                    expandedKitsBody.type = "classic";
                    expandedKitsBody.classic = {
                        from: new Date(req.body.classic.from),
                        to: new Date(req.body.classic.to),
                    };
                }
                expandedKitsBody.rentObj = {};
                expandedKitsBody.rentObj.kits = expandedKits;
                
                //resettiamo l'altro campo
                if(req.body.type === "classic") req.body.period = undefined;
                else req.body.classic = undefined

          
                //aggiorna il noleggio col prezzo
                const updatedRent = await Rents.findByIdAndUpdate(req.params.id, {$set: {...req.body, price: calcPrice(expandedKitsBody, car, false),}}, { new: true, runValidators: true, useFindAndModify: false }).populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            });
        
                res.status(200).json({
                    success: true,
                    data: updatedRent,
                });
            } catch (error) {
                return next(error);
            }
    }
    
});

//delete
router.route("/:id").delete(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" && req.userInfo.role === "manager") {
        try {
            const rentToDelete = await Rents.findById(req.params.id);

            if (!rentToDelete) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404));
            } else {
                if (rentToDelete.type === "period") {
                    if (rentToDelete.period.since > new Date()) {
                        await Rents.findByIdAndDelete(req.params.id);
                        res.status(200).json({
                            success: true,
                            data: "Noleggio eliminato",
                        });
                    } else {
                        return next(
                            new ErrorResponse(
                                "Non si può eliminare un noleggio già iniziato",
                                400
                            )
                        );
                    }
                } else {
                    if (rentToDelete.classic.from > new Date()) {
                        await Rents.findByIdAndDelete(req.params.id);
                        res.status(200).json({
                            success: true,
                            data: "Noleggio eliminato",
                        });
                    } else {
                        return next(
                            new ErrorResponse(
                                "Non si può eliminare un noleggio già iniziato",
                                400
                            )
                        );
                    }
                }
            }

            res.status(200).json({ success: true, data: "Noleggio eliminato" });
        } catch (error) {
            return next(new ErrorResponse(error));
        }
    } else {
        //prendiamo il rent da cancellare
        const rentToDelete = await Rents.findById(req.params.id);

        if (!rentToDelete) {
            return next(new ErrorResponse("Nessun noleggio trovato", 404));
        } else {

            if (rentToDelete.customer === String(req.userInfo._id)) {
                return next(new ErrorResponse("Non autorizzato", 403))
            } 

            if (rentToDelete.type === "period") {
                if (rentToDelete.period.since > new Date()) {
                    await Rents.findByIdAndDelete(req.params.id);
                    res.status(200).json({
                        success: true,
                        data: "Noleggio eliminato",
                    });
                } else {
                    return next(
                        new ErrorResponse(
                            "Non si può eliminare un noleggio già iniziato",
                            400
                        )
                    );
                }
            } else {
                if (rentToDelete.classic.from > new Date()) {
                    await Rents.findByIdAndDelete(req.params.id);
                    res.status(200).json({
                        success: true,
                        data: "Noleggio eliminato",
                    });
                } else {
                    return next(
                        new ErrorResponse(
                            "Non si può eliminare un noleggio già iniziato",
                            400
                        )
                    );
                }
            }
        }

        
    }
});

//get price of model id
router.route("/getPrice/:id").get(async (req, res, next) => {
    try {
        if (!req.query)
            return next(new ErrorResponse("Richiesta non corretta", 400));
        else {
            let rent = {};
            if (req.query.type === "period") {
                rent.type = "period";
                rent.period = {
                    from: parseInt(req.query.from),
                    to: parseInt(req.query.to),
                    for: parseInt(req.query.for),
                    since: new Date(req.query.since),
                    singleDay: req.query.from === req.query.to,
                };
            } else {
                rent.type = "classic";
                rent.classic = {
                    from: new Date(req.query.from),
                    to: new Date(req.query.to),
                };
            }

            rent.rentObj = {};
            rent.rentObj.kits = req.query.kits.split(";").map((kit) => {
                return { price: parseInt(kit) };
            });

            const car = await Cars.findById(req.params.id);

            if (!car) return next(new ErrorResponse("Auto non trovata", 404));

            let info = calcPrice(rent, car, true);

            res.status(200).json({ success: true, data: info });
        }
    } catch (error) {
        return next(error);
    }
});

//others

module.exports = router;

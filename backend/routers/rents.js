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

/**
 * il body deve essere uguale al modello rent in '../models/Rent
 */
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
    if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
        try {
            const rents = await Rents.find()
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                })

            res.status(200).json({ success: true, data: rents });
        } catch (error) {
            return next(new ErrorResponse(error));
        }
    } else {
        return next(new ErrorResponse("Non autorizzato", 403));
    }
});

//read id noleggio
router.route("/:id").get(protect, async (req, res, next) => {
    try {
        const rent = await Rents.findById(req.params.id)
            .populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            })

        if (!rent) {
            return next(new ErrorResponse("Nessun noleggio trovato", 404));
        }

        res.status(200).json({ success: true, data: rent });
    } catch (error) {
        return next(new ErrorResponse(error));
    }
});

//read by user id
router.route("/users/:id").get(protect, async (req, res, next) => {
    if (
        req.userInfo._id == req.params.id ||
        (req.userInfo.role === "admin" || req.userInfo.role === "manager")
    ) {
        try {
            const rents = await Rents.find({ customer: req.params.id })
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                })

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

//read by car id
router.route("/cars/:id").get(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
        try {
            const rents = await Rents.find({ "rentObj.car": req.params.id })
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                })

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

/**
 * Nel body si mettono i campi da modificare con riferimento a '../models/Rents'
 */
router.route("/:id").put(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {

        let changeState = req.query.changeState; //visto che i noleggi cambiano stato anche quando sono in corso questo parametro di query permette di far capire che si sta cambiando stato e quindi e' ammesso sempre

        if (changeState) {
            try {

                const rentToUpdate = await Rents.findByIdAndUpdate(     //aggiorna senza il prezzo il noleggio in modo da avere lo stato / is late nuovo
                    req.params.id,
                    {
                        $set: {
                            ...req.body,
                        },
                    },
                    { new: true, runValidators: true, useFindAndModify: false }
                )
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                })
                .populate({
                    path: "rentObj",
                    populate: { path: "kits", model: "Kits" },
                });

                rentToUpdate.price = calcPrice(rentToUpdate, rentToUpdate.rentObj.car, false)   //calcola il prezzo
                await rentToUpdate.save();

                const updatedRent = await Rents.findById(req.params.id) //ritorna solo gli id dei kits
                .populate("customer")
                .populate({
                    path: "rentObj",
                    populate: { path: "car", model: "Cars" },
                })

            return res.status(200).json({
                success: true,
                data: updatedRent,
            });
            } catch (error) {
                return next(error)
            }
        }

        const rentToUpdate = await Rents.findById(req.params.id)
            .populate("customer")
            .populate({
                path: "rentObj",
                populate: { path: "car", model: "Cars" },
            })

        if (!rentToUpdate) {
            return next(new ErrorResponse("Nessun noleggio trovato", 404));
        }
        try {
            //macchina che stiamo per noleggiare
            const car = await Cars.findById(req.body.rentObj.car);
            if (!car)
                return next(new ErrorResponse("Richiesta non valida", 400));

            //cerchiamo tutti i rent relativi a tale macchina
            const history = await Rents.find({
                "rentObj.car": mongoose.Types.ObjectId(car._id),
            });

            //costruiamo l'oggetto che contiene le informazioni sulle date del noleggio
            let dateRange;

            if (req.body.type === "period") {
                //noleggio iniziato
                if (rentToUpdate.period.since <= new Date())
                    return next(
                        new ErrorResponse(
                            "Impossibile modificare un noleggio già iniziato.",
                            400
                        )
                    );

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
                if (rentToUpdate.classic.from <= new Date())
                    return next(
                        new ErrorResponse(
                            "Impossibile modificare un noleggio già iniziato.",
                            400
                        )
                    );
                dateRange = {
                    type: "classic",
                    classic: {
                        from: req.body.classic.from,
                        to: req.body.classic.to,
                    },
                };
            }

            dateRange.id = rentToUpdate._id; //quest informazione serve per checkavaiability a saltare questo noleggio (senno' non sarebbe mai disponibile)

            //controlla se la macchina è disponibile
            if (
                history.length > 0 &&
                !checkAvailability(history, car, dateRange)
            )
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
            expandedKitsBody.isLate = req.body.isLate;

            //resettiamo l'altro campo
            if (req.body.type === "classic") req.body.period = undefined;
            else req.body.classic = undefined;

            //aggiorna il noleggio col prezzo
            const updatedRent = await Rents.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        ...req.body,
                        price: calcPrice(expandedKitsBody, car, false),
                    },
                },
                { new: true, runValidators: true, useFindAndModify: false }
            )
                .populate("customer")
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
    } else {
        //prendiamo il rent da updatare
        const rentToUpdate = await Rents.findById(req.params.id);

        if (!rentToUpdate) {
            return next(new ErrorResponse("Nessun noleggio trovato", 404));
        }

        if (rentToUpdate.customer === String(req.userInfo._id)) {
            return next(new ErrorResponse("Non autorizzato", 403));
        }

        //altrimenti procediamo come con la creazione
        try {
            //macchina che stiamo per noleggiare
            const car = await Cars.findById(req.body.rentObj.car);
            if (!car)
                return next(new ErrorResponse("Richiesta non valida", 400));

            //cerchiamo tutti i rent relativi a tale macchina
            const history = await Rents.find({
                "rentObj.car": mongoose.Types.ObjectId(car._id),
            });

            //costruiamo l'oggetto che contiene le informazioni sulle date del noleggio
            let dateRange;

            if (req.body.type === "period") {
                //noleggio iniziato
                if (rentToUpdate.period.since <= new Date())
                    return next(
                        new ErrorResponse(
                            "Impossibile modificare un noleggio già iniziato.",
                            400
                        )
                    );

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
                if (rentToUpdate.classic.from <= new Date())
                    return next(
                        new ErrorResponse(
                            "Impossibile modificare un noleggio già iniziato.",
                            400
                        )
                    );
                dateRange = {
                    type: "classic",
                    classic: {
                        from: req.body.classic.from,
                        to: req.body.classic.to,
                    },
                };
            }

            dateRange.id = rentToUpdate._id; //quest informazione serve per checkavaiability a saltare questo noleggio (senno' non sarebbe mai disponibile)

            //controlla se la macchina è disponibile
            if (
                history.length > 0 &&
                !checkAvailability(history, car, dateRange)
            )
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
            expandedKitsBody.isLate = req.body.isLate;

            //resettiamo l'altro campo
            if (req.body.type === "classic") req.body.period = undefined;
            else req.body.classic = undefined;

            //aggiorna il noleggio col prezzo
            const updatedRent = await Rents.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        ...req.body,
                        price: calcPrice(expandedKitsBody, car, false),
                    },
                },
                { new: true, runValidators: true, useFindAndModify: false }
            )
                .populate("customer")
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

//delete id rent
router.route("/:id").delete(protect, async (req, res, next) => {
    if (req.userInfo.role === "admin" || req.userInfo.role === "manager") {
        try {
            const rentToDelete = await Rents.findById(req.params.id);

            if (!rentToDelete) {
                return next(new ErrorResponse("Nessun noleggio trovato", 404));
            } else {
                if (rentToDelete.type === "period") {
                    if (rentToDelete.period.since > new Date()) {
                        //controlla che non sia gia' iniziato
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
                        //controlla che non sia gia' iniziato
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
        //un utente che richiede una delete di un rent
        //prendiamo il rent da cancellare
        const rentToDelete = await Rents.findById(req.params.id);

        if (!rentToDelete) {
            return next(new ErrorResponse("Nessun noleggio trovato", 404));
        } else {
            if (rentToDelete.customer === String(req.userInfo._id)) {
                //controlla che l'id customer e' di chi fa la request di delete
                return next(new ErrorResponse("Non autorizzato", 403));
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

/**
 * Nella query bisogna passare i dati del noleggio (se e' period o classic e le date relative).
 * Inoltre i kits si passano come stringa, PASSANDO SOLO IL PREZZO DEL KIT, e separati da un ;
 * L'auto si passa l'id.
 * Ritorna un oggetto con informazioni sul prezzo (come prezzo totale, sconti, penali ecc).
 */
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

            rent.isLate = req.query.isLate === "true";
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

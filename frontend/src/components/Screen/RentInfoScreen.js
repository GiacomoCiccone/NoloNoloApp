import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import {
    DatePicker,
    Descriptions,
    Divider,
    InputNumber,
    message,
    PageHeader,
    TimePicker,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import { useLocation } from "react-router-dom";

//componenti
import Protected from "../Protected";
import Loading from "../Loading";
import Tooltip from "../Tooltip";
import Logo from "../Logo";

const days = [
    "",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venedrì",
    "Sabato",
    "Domenica",
];

const RentInfoScreen = (props) => {
    const location = useLocation();
    const rentId = location.pathname.split("/")[2];

    //redux stuff
    const { authToken, userInfo } = useSelector((state) => state.user);

    //stato
    const [isLoading, setIsLoading] = useState(false);
    const [rent, setRent] = useState(null);
    const [place, setPlace] = useState(null);
    const [kits, setKits] = useState([]);

    const [isModifing, setIsModifing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [weekPeriod, setWeekPeriod] = useState(null);
    const [daysPeriod, setDaysPeriod] = useState(null);
    const [startDatePeriod, setStartDatePeriod] = useState(
        //domani
        new Date(new Date().setHours(23, 59, 59, 59) + 1000)
    );

    const [startDate, setStartDate] = useState(
        new Date(new Date().setHours(0, 0, 0, 0))
    );
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [disabledHoursStart, setDisabledHoursStart] = useState(null);
    const [disabledHoursEnd, setDisabledHoursEnd] = useState(null);
    const [isPeriodic, setIsPeriodic] = useState(false);

    const [priceInfo, setPriceInfo] = useState(null);

    //prende il rent corrente con tutte le informazioni
    useEffect(() => {
        const fetchRent = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                };
                setIsLoading(true);
                const { data } = await axios.get(
                    `/api/rents/${rentId}`,
                    config
                );
                setIsLoading(false);
                setRent(data.data);
            } catch (error) {
                setIsLoading(false);
                props.history.push("/rents/");
            }
        };

        fetchRent();
    }, [authToken, props.history, rentId]);

    //prende i place per comodita'
    useEffect(() => {
        const fetchPlaceInfo = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(
                    `/api/pickups/${rent.rentObj.car.place}`
                );
                setPlace(data.data.point);

                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setPlace("");
            }
        };

        if (rent) fetchPlaceInfo();
    }, [rent]);

    //prende i kits per comodita'
    useEffect(() => {
        const fetchKits = async () => {
            try {
                setIsLoading(true);

                const { data } = await axios.get("/api/kits");
                if (data.data.length > 0) {
                    setKits(data.data);
                } else {
                    setKits([]);
                }
                setIsLoading(false);
            } catch (error) {
                setKits([]);
            }
        };

        if (rent) fetchKits();
    }, [rent]);

    //modifica il rent corrente, se possibile
    const modifyRent = async (e) => {
        e.preventDefault();
        if (!canModify()) return;

        var newRent = {};

        newRent.customer = rent.customer._id;
        newRent.rentObj = {};
        newRent.rentObj.car = rent.rentObj.car._id;
        newRent.rentObj.kits = rent.rentObj.kits;
        newRent.address = rent.address;
        newRent.adminActions = rent.adminActions;
        newRent.state = "pending";

        if (isPeriodic) {
            newRent.classic = undefined;
            newRent.type = "period";
            newRent.period = {};
            newRent.period.since = new Date(
                new Date(startDatePeriod).setHours(0, 0, 0, 0)
            );
            newRent.period.from = ((startDatePeriod.getDay() + 6) % 7) + 1;
            newRent.period.to = newRent.period.from;
            for (let i = 0; i < daysPeriod - 1; i++) {
                newRent.period.to = newRent.period.to + 1;
                if (newRent.period.to === 8) {
                    newRent.period.to = 1;
                }
            }
            newRent.period.for = weekPeriod;
            newRent.period.singleDay =
                newRent.period.from === newRent.period.to;
        } else {
            newRent.period = undefined;
            newRent.type = "classic";
            newRent.classic = {};
            newRent.classic.from = new Date(
                startDate.setHours(new Date(startTime).getHours())
            );
            newRent.classic.to = new Date(
                endDate.setHours(new Date(endTime).getHours())
            );
        }

        try {
            setIsLoading(true);
            setIsModifing(false);
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };
            const { data } = await axios.put(
                `/api/rents/${rentId}`,
                newRent,
                config
            );

            //resettiamo tutto
            setWeekPeriod(null);
            setDaysPeriod(null);
            setStartDatePeriod(
                new Date(new Date().setHours(23, 59, 59, 59) + 1000)
            );
            setStartDate(new Date(new Date().setHours(0, 0, 0, 0)));
            setEndDate(null);
            setStartTime(null);
            setEndTime(null);
            setDisabledHoursEnd(null);
            setDisabledHoursEnd(null);
            setIsPeriodic(false);

            setRent(data.data);
            setIsLoading(false);
            setIsModifing(false);

            message.success({
                content: (
                    <span role="alert">Noleggio modificato con successo</span>
                ),
                duration: 5,
            });
        } catch (error) {
            setIsLoading(false);
            message.error({
                content: <span role="alert">{error.response.data.error}</span>,
                duration: 5,
            });
        }
    };

    const deleteRent = async () => {
        try {
            setIsDeleting(false);
            setIsLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };
            await axios.delete(`/api/rents/${rentId}`, config);

            message.success({
                content: (
                    <span role="alert">Noleggio modificato con successo</span>
                ),
                duration: 5,
            });
            setIsLoading(false);
            props.history.push("/rents");
        } catch (error) {
            setIsLoading(false);
            message.error({
                content: <span role="alert">{error.response.data.error}</span>,
                duration: 5,
            });
        }
    };

    useEffect(() => {
        const updatePrice = async () => {
            var searchObj = {};
            if (rent.type === "period") {
                searchObj = {
                    type: "period",
                    from: rent.period.from,
                    to: rent.period.to,
                    since: rent.period.since,
                    singleDay: rent.period.singleDay,
                    for: rent.period.for,
                };
            } else {
                searchObj = {
                    type: "classic",
                    from: rent.classic.from,
                    to: rent.classic.to,
                };
            }

            searchObj.kits = "";
            searchObj.isLate = rent.isLate;
            if (rent.rentObj.kits.length > 0) {
                rent.rentObj.kits.forEach((kitIn, i) => {
                    searchObj.kits += `${
                        kits.filter((kit) => kit._id === kitIn)[0].price
                    }`;
                    if (i < rent.rentObj.kits.length - 1) searchObj.kits += ";";
                });
            }

            try {
                setIsLoading(true);
                const { data } = await axios.get(
                    `/api/rents/getPrice/${rent.rentObj.car._id}`,
                    {
                        params: { ...searchObj },
                    }
                );
                setPriceInfo(data.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setPriceInfo({});
            }
        };

        if (rent) updatePrice();
    }, [rent, kits]);

    const canModify = () => {
        if (!authToken) {
            if (!place) return false;
            else return true;
        } else {
            if (!isPeriodic) {
                if (!place || !startDate || !endDate || !startTime || !endTime)
                    return false;
                else return true;
            } else {
                if (!place || !startDatePeriod || !weekPeriod || !daysPeriod)
                    return false;
                else return true;
            }
        }
    };

    useEffect(() => {
        if (startDate?.getTime() === new Date().setHours(0, 0, 0, 0)) {
            let range = [];
            for (let i = 0; i <= new Date().getHours(); i++) {
                range.push(i);
            }
            setDisabledHoursStart(range);
        } else {
            setDisabledHoursStart([]);
        }

        if (startDate?.getTime() === endDate?.getTime()) {
            let time = startTime?.format("HH");
            if (time !== undefined) {
                // eslint-disable-next-line
                time[0] === "0" ? (time = time.substr(1, 1)) : (time = time);
                time = parseInt(time);
                let range = [];
                for (let i = 0; i <= time; i++) {
                    range.push(i);
                }
                setDisabledHoursEnd(range);
            } else {
                setDisabledHoursEnd([]);
            }
        } else {
            setDisabledHoursEnd([]);
        }
    }, [startDate, endDate, startTime, endTime]);

    useEffect(() => {
        //endDate cosi e' sempre oltre startdate
        setEndDate(startDate);
    }, [startDate]);

    return (
        <Protected history={props.history}>
            {authToken && (
                <div
                    style={{ minHeight: "calc(100vh - 5rem)" }}
                    className="py-16 pt-8 relative"
                >
                    <Loading loading={isLoading}>
                        <div>
                            {rent && (
                                <div className="container px-4 mx-auto">
                                    {/* Titolo */}
                                    <PageHeader
                                        onBack={() =>
                                            props.history.push("/rents")
                                        }
                                        title={`Noleggio ${rentId}`}
                                    />

                                    <Divider />

                                    {rent.state !== "concluded" && (
                                        <>
                                            <Descriptions
                                                labelStyle={{
                                                    fontWeight: "600",
                                                }}
                                                title="Descrizione noleggio"
                                                layout="vertical"
                                                bordered
                                            >
                                                <Descriptions.Item label="Prodotto">
                                                    {rent.rentObj.car.model}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Luogo di ritiro">
                                                    {place}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Dat creazione noleggio">
                                                    {new Date(
                                                        rent.createdAt
                                                    ).toLocaleDateString(
                                                        "it-IT"
                                                    )}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Tipologia noleggio">
                                                    {rent.type === "classic"
                                                        ? "Classico"
                                                        : "Periodico"}
                                                </Descriptions.Item>
                                                {rent.type === "period" ? (
                                                    <>
                                                        <Descriptions.Item label="Inizio periodo">
                                                            {new Date(
                                                                rent.period.since
                                                            ).toLocaleDateString(
                                                                "it-IT"
                                                            )}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Durata periodo">
                                                            {rent.period.for +
                                                                " settimane"}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Giorni settimanali">
                                                            {days[
                                                                rent.period.from
                                                            ] +
                                                                " - " +
                                                                days[
                                                                    rent.period
                                                                        .to
                                                                ]}
                                                        </Descriptions.Item>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Descriptions.Item label="Data di inizio">
                                                            {new Date(
                                                                rent.classic.from
                                                            ).toLocaleDateString() +
                                                                ` - ${new Date(
                                                                    rent.classic.from
                                                                ).getHours()}:00`}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Data di fine">
                                                            {new Date(
                                                                rent.classic.to
                                                            ).toLocaleDateString() +
                                                                ` - ${new Date(
                                                                    rent.classic.to
                                                                ).getHours()}:00`}
                                                        </Descriptions.Item>
                                                    </>
                                                )}

                                                <Descriptions.Item label="Stato noleggio">
                                                    <div
                                                        className={`badge ${
                                                            rent.isLate &&
                                                            rent.state !==
                                                                "concluded"
                                                                ? "badge-error"
                                                                : rent.state ===
                                                                  "pending"
                                                                ? " badge-warning"
                                                                : rent.state ===
                                                                  "accepted"
                                                                ? "badge-info"
                                                                : "badge-success"
                                                        }`}
                                                    >
                                                        {rent.isLate &&
                                                        rent.state !==
                                                            "concluded"
                                                            ? "In ritardo"
                                                            : rent.state ===
                                                              "pending"
                                                            ? "Pendente"
                                                            : rent.state ===
                                                              "accepted"
                                                            ? "Accettato"
                                                            : "Concluso"}
                                                    </div>{" "}
                                                </Descriptions.Item>

                                                {rent.rentObj.kits.length > 0 &&
                                                    kits && (
                                                        <Descriptions.Item label="Kits">
                                                            {rent.rentObj.kits.map(
                                                                (kit, i) => (
                                                                    <p
                                                                        key={`kit-${i}`}
                                                                    >
                                                                        {
                                                                            kits.filter(
                                                                                (
                                                                                    kitGlobal
                                                                                ) =>
                                                                                    kitGlobal._id ===
                                                                                    kit
                                                                            )[0]
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                )
                                                            )}
                                                        </Descriptions.Item>
                                                    )}

                                                <Descriptions.Item
                                                    label={
                                                        <div>
                                                            <span>
                                                                Prezzo finale
                                                            </span>{" "}
                                                            <Tooltip
                                                                color="blue"
                                                                title="Il prezzo finale potrebbe variare in seguito a modifiche del noleggio, o nel caso in cui l'auto venga restituita in ritardo. In tal caso si applica un sovrapprezzo che verrà mostrato nella fattura una volta concluso il noleggio."
                                                                icon="bi-info-circle-fill"
                                                                type="info"
                                                            />{" "}
                                                        </div>
                                                    }
                                                >
                                                    {parseFloat(rent.price).toFixed(2) +
                                                        "€"}
                                                </Descriptions.Item>
                                            </Descriptions>

                                            <br />
                                            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 justify-center">
                                                <div
                                                    style={{
                                                        maxWidth: "12rem",
                                                    }}
                                                    className="w-full"
                                                >
                                                    <button
                                                        aria-label="Clicca per eliminare il tuo noleggio."
                                                        className="btn btn-error btn-block"
                                                        type="button"
                                                        onClick={() =>
                                                            setIsDeleting(true)
                                                        }
                                                    >
                                                        <span className="text-white">
                                                            Annulla noleggio
                                                        </span>
                                                    </button>
                                                </div>

                                                <div
                                                    style={{
                                                        maxWidth: "12rem",
                                                    }}
                                                    className="w-full"
                                                >
                                                    <button
                                                        aria-label="Clicca per modificare il tuo noleggio."
                                                        onClick={() =>
                                                            setIsModifing(true)
                                                        }
                                                        className="btn btn-warning btn-block"
                                                        type="button"
                                                    >
                                                        <span className="text-white">
                                                            Modifica noleggio
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {rent.state === "concluded" && (
                                        <div className="mx-auto container min-h-screen">
                                            <div className="flex items-center justify-between mb-8 gap-2 px-3">
                                                <div className="truncate">
                                                    <span className="text-2xl ">
                                                        Fattura #
                                                    </span>
                                                    : {rent._id}
                                                    <br />
                                                    <span>Data</span>:{" "}
                                                    {new Date(
                                                        rent.concludedAt
                                                    ).toLocaleDateString(
                                                        "it-IT"
                                                    )}
                                                    <br />
                                                </div>
                                                <div className="text-right">
                                                    <Logo />
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row justify-between mb-8 px-3 gap-2">
                                                <div className="truncate">
                                                    <h2 className="truncate">
                                                        Dati cliente
                                                    </h2>
                                                    {userInfo.first_name}{" "}
                                                    {userInfo.last_name}
                                                    <br />
                                                    {rent.address ? rent.address.via : userInfo.address.via}
                                                    <br />
                                                    {rent.address ? rent.address.city : userInfo.address.city}{" "}
                                                    {rent.address ? rent.address.postal_code : userInfo.address.postal_code}
                                                    <br />
                                                    {userInfo.email}
                                                    <br />
                                                </div>
                                                <div className="md:text-right truncate">
                                                    <h2 className="truncate">
                                                        Dati fornitore
                                                    </h2>
                                                    NoloNolo<sup>+</sup>
                                                    <br />
                                                    Mura Anteo Zamboni, 7<br />
                                                    40126 Bologna BO
                                                    <br />
                                                    <span className="">
                                                        https://site202121.tw.cs.unibo.it/
                                                    </span>
                                                </div>
                                            </div>

                                            {priceInfo && (
                                                <>
                                                    <div className="border border-t-2 mb-8 px-3"></div>
                                                    <h2>
                                                        Riepilogo oggetti
                                                        noleggiati
                                                    </h2>
                                                    <br />
                                                    <div className="flex justify-between mb-4 bg-base-200 px-3 py-2">
                                                        <div>
                                                            {
                                                                rent.rentObj.car
                                                                    .model
                                                            }
                                                        </div>
                                                        <div className="text-right font-medium">
                                                            {
                                                                parseFloat(priceInfo.modelPrice).toFixed(2)
                                                            }{" "}
                                                            €{" "}
                                                            <span className="text-xs">
                                                                /h
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {rent.rentObj.kits.length >
                                                        0 && (
                                                        <>
                                                            {rent.rentObj.kits.map(
                                                                (kit, i) => (
                                                                    <div
                                                                        key={`kit-${i}`}
                                                                        className="flex justify-between mb-4 bg-base-200 px-3 py-2"
                                                                    >
                                                                        <div>
                                                                            {
                                                                                kits.filter(
                                                                                    (
                                                                                        kitGlobal
                                                                                    ) =>
                                                                                        kitGlobal._id ===
                                                                                        kit
                                                                                )[0]
                                                                                    ?.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-right font-medium">
                                                                            {
                                                                                kits.filter(
                                                                                    (
                                                                                        kitGlobal
                                                                                    ) =>
                                                                                        kitGlobal._id ===
                                                                                        kit
                                                                                )[0]
                                                                                    ?.price
                                                                            }{" "}
                                                                            €{" "}
                                                                            <span className="text-xs">
                                                                                /h
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </>
                                                    )}

                                                    <div className="flex justify-between mb-4 bg-base-200 px-3 py-2">
                                                        <div>
                                                            Ore totali di
                                                            noleggio
                                                        </div>
                                                        <div className="text-right font-medium">
                                                            {
                                                                priceInfo.totalHours
                                                            }{" "}
                                                            <span className="text-xs">
                                                                h
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between mb-4 bg-base-200 px-3 py-2 text-success">
                                                        <div>Sconti</div>
                                                        <div className="text-right font-medium">
                                                            -{" "}
                                                            {parseFloat(priceInfo.discount).toFixed(2)}{" "}
                                                            €
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between mb-4 bg-base-200 px-3 py-2 text-error">
                                                        <div>
                                                            <span>Penale</span>
                                                            {/* Tooltip ritardo consegna*/}
                                                            <Tooltip
                                                                color="blue"
                                                                title="Nel caso in cui l'auto venga riconsegnata in ritardo il conteggio delle ore totali aumenta del 25%."
                                                                icon="bi-info-circle-fill"
                                                                type="info"
                                                            />
                                                        </div>
                                                        <div className="text-right font-medium">
                                                            + {parseFloat(priceInfo.penal).toFixed(2)}{" "}
                                                            €
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between mb-4 bg-base-300 p-4">
                                                        <div className="text-xl font-bold">
                                                            Prezzo finale
                                                        </div>
                                                        <div className="text-right font-medium text-xl">
                                                            {
                                                                parseFloat(priceInfo.finalPrice).toFixed(2)
                                                            }{" "}
                                                            €
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div className="mb-8 text-4xl text-center px-3">
                                                <span>Grazie!</span>
                                            </div>

                                            <div className="text-center text-sm px-3">
                                                https://site202121.tw.cs.unibo.it/
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Loading>

                    {/* Modale modifica noleggio */}
                    <Modal
                        title="Modifica le date del tuo noleggio"
                        centered
                        visible={isModifing}
                        okButtonProps={{ style: { display: "none" } }}
                        onCancel={() => setIsModifing(false)}
                        cancelText="Chiudi"
                    >
                        <form onSubmit={modifyRent}>
                            <>
                                <div className="flex items-center gap-4 justify-center">
                                    <button
                                        aria-label="Clicca per passare a tipologia noleggio classico."
                                        onClick={() => setIsPeriodic(false)}
                                        className={`btn btn-sm ${
                                            !isPeriodic && "btn-primary"
                                        }`}
                                        type="button"
                                    >
                                        <span
                                            className={`${
                                                !isPeriodic &&
                                                "text-primary-content"
                                            }`}
                                        >
                                            Classico
                                        </span>
                                    </button>
                                    <button
                                        aria-label="Clicca per passare a tipologia noleggio periodico."
                                        onClick={() => setIsPeriodic(true)}
                                        className={`btn btn-sm ${
                                            isPeriodic && "btn-primary"
                                        }`}
                                        type="button"
                                    >
                                        <span
                                            className={`${
                                                isPeriodic &&
                                                "text-primary-content"
                                            }`}
                                        >
                                            Periodico
                                        </span>
                                    </button>
                                </div>
                                <br />

                                <br />
                                {!isPeriodic ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <label
                                                    id="start-day-classic"
                                                    className="font-medium"
                                                >
                                                    Data di inizio
                                                </label>
                                                <DatePicker
                                                    allowClear={false}
                                                    aria-labelledby="start-day-classic"
                                                    placeholder="Selezionare la data di inizio"
                                                    value={moment(startDate)}
                                                    format="DD/MM/YYYY"
                                                    disabledDate={(current) =>
                                                        current.valueOf() <
                                                        new Date(
                                                            new Date().setDate(
                                                                new Date().getDate() -
                                                                    1
                                                            )
                                                        )
                                                    }
                                                    style={{ width: "100%" }}
                                                    onChange={(val) =>
                                                        setStartDate(
                                                            new Date(
                                                                val
                                                                    .toDate()
                                                                    .setHours(
                                                                        0,
                                                                        0,
                                                                        0,
                                                                        0
                                                                    )
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="w-full">
                                                <label
                                                    id="start-time-classic"
                                                    className="font-medium"
                                                >
                                                    Ora di inizio
                                                </label>
                                                <TimePicker
                                                    aria-labelledby="start-time-classic"
                                                    format={"HH"}
                                                    style={{ width: "100%" }}
                                                    onChange={(time) =>
                                                        setStartTime(time)
                                                    }
                                                    disabledHours={() =>
                                                        disabledHoursStart
                                                    }
                                                    showNow={false}
                                                    showSecond={false}
                                                    showMinute={false}
                                                    inputReadOnly={true}
                                                    placeholder="Selezionare l'ora di inizio"
                                                    value={startTime}
                                                />
                                            </div>
                                        </div>
                                        <br />

                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <label
                                                    id="end-day-classic"
                                                    className="font-medium"
                                                >
                                                    Data di fine
                                                </label>
                                                <DatePicker
                                                    allowClear={false}
                                                    aria-labelledby="end-day-classic"
                                                    value={moment(endDate)}
                                                    placeholder="Selezionare la data di fine"
                                                    format="DD/MM/YYYY"
                                                    disabledDate={(current) =>
                                                        current.valueOf() <
                                                        new Date(
                                                            new Date().setDate(
                                                                new Date(
                                                                    startDate
                                                                ).getDate()
                                                            )
                                                        )
                                                    }
                                                    style={{ width: "100%" }}
                                                    onChange={(val) =>
                                                        setEndDate(
                                                            new Date(
                                                                val
                                                                    .toDate()
                                                                    .setHours(
                                                                        0,
                                                                        0,
                                                                        0,
                                                                        0
                                                                    )
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="w-full">
                                                <label
                                                    id="start-end-classic"
                                                    className="font-medium"
                                                >
                                                    Ora di fine
                                                </label>
                                                <TimePicker
                                                    aria-labelledby="start-end-classic"
                                                    format={"HH"}
                                                    style={{ width: "100%" }}
                                                    onChange={(time) =>
                                                        setEndTime(time)
                                                    }
                                                    disabledHours={() =>
                                                        disabledHoursEnd
                                                    }
                                                    showNow={false}
                                                    showSecond={false}
                                                    showMinute={false}
                                                    inputReadOnly={true}
                                                    value={endTime}
                                                    placeholder="Selezionare l'ora di fine"
                                                />
                                            </div>
                                        </div>

                                        <br />
                                        <div className="w-full flex items-center justify-center mt-4">
                                            {/* Modifica noleggio - classico */}
                                            <input
                                                aria-disabled={!canModify()}
                                                aria-label={`${
                                                    !canModify()
                                                        ? "Riempi tutti i campi per modificare il tuo noleggio."
                                                        : "Modifica noleggio."
                                                }`}
                                                type="submit"
                                                value="Modifica noleggio"
                                                style={{ color: "#fff" }}
                                                className={`btn ${
                                                    !canModify()
                                                        ? "btn-error"
                                                        : "btn-primary"
                                                } btn-block normal-case`}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <label
                                                    id="start-day-period"
                                                    className="font-medium"
                                                >
                                                    Data di inizio
                                                </label>
                                                <DatePicker
                                                    allowClear={false}
                                                    aria-labelledby="start-day-period"
                                                    placeholder="Selezionare la data di inizio"
                                                    value={moment(
                                                        startDatePeriod
                                                    )}
                                                    format="DD/MM/YYYY"
                                                    disabledDate={(current) =>
                                                        current.valueOf() <
                                                        new Date(
                                                            new Date().setDate(
                                                                new Date().getDate()
                                                            )
                                                        )
                                                    }
                                                    style={{ width: "100%" }}
                                                    onChange={(val) =>
                                                        setStartDatePeriod(
                                                            new Date(
                                                                val
                                                                    .toDate()
                                                                    .setHours(
                                                                        0,
                                                                        0,
                                                                        0,
                                                                        0
                                                                    )
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="w-full">
                                                <div className="flex items-center">
                                                    <label
                                                        id="period-weeks"
                                                        className="font-medium"
                                                    >
                                                        Durata periodo
                                                    </label>
                                                    {/* Tooltip periodo*/}
                                                    <Tooltip
                                                        color="blue"
                                                        title="Il periodo è misurato in settimane. Si può noleggiare minimo per una settimana, massimo per 54 settimane."
                                                        icon="bi-info-circle-fill"
                                                        type="info"
                                                    />
                                                </div>

                                                <InputNumber
                                                    aria-labelledby="period-weeks"
                                                    style={{ width: "100%" }}
                                                    min={1}
                                                    max={54}
                                                    value={weekPeriod}
                                                    onChange={(value) =>
                                                        setWeekPeriod(value)
                                                    }
                                                />
                                            </div>

                                            <div className="w-full">
                                                <div className="flex items-center">
                                                    <label
                                                        id="period-days"
                                                        className="font-medium"
                                                    >
                                                        Giorni di utilizzo
                                                    </label>
                                                    {/* Tooltip giorni*/}
                                                    <Tooltip
                                                        color="blue"
                                                        title="Si può noleggiare un'auto nel periodo scelto da uno fino a 7 giorni la settimana."
                                                        icon="bi-info-circle-fill"
                                                        type="info"
                                                    />
                                                </div>

                                                <InputNumber
                                                    aria-labelledby="period-days"
                                                    style={{ width: "100%" }}
                                                    min={1}
                                                    max={7}
                                                    value={daysPeriod}
                                                    onChange={(value) =>
                                                        setDaysPeriod(value)
                                                    }
                                                />
                                            </div>
                                            <br />
                                        </div>

                                        {/* Modifica noleggio - periodico */}

                                        <div className="w-full flex items-center justify-center mt-4">
                                            <input
                                                aria-disabled={!canModify()}
                                                aria-label={`${
                                                    !canModify()
                                                        ? "Riempi tutti i campi per modificare il tuo noleggio."
                                                        : "Modifica noleggio."
                                                }`}
                                                type="submit"
                                                value="Modifica noleggio"
                                                style={{ color: "#fff" }}
                                                className={`btn ${
                                                    !canModify()
                                                        ? "btn-error"
                                                        : "btn-primary"
                                                } btn-block normal-case`}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        </form>
                    </Modal>

                    {/* Modale elimina noleggio */}
                    <Modal
                        title="Annulla il tuo noleggio"
                        centered
                        visible={isDeleting}
                        onOk={deleteRent}
                        onCancel={() => setIsDeleting(false)}
                        cancelText="Chiudi"
                        okText="Conferma"
                        okType="danger"
                    >
                        <div className="alert alert-warning">
                            <div className="flex-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 mx-2 stroke-current"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    ></path>
                                </svg>
                                <label>
                                    Annullando il noleggio perderai la
                                    prenotazione della macchina nelle date
                                    scelte!
                                </label>
                            </div>
                        </div>
                    </Modal>
                </div>
            )}
        </Protected>
    );
};

export default RentInfoScreen;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import queryString from "query-string";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Divider, List, message, PageHeader, Result, Space } from "antd";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

//componenti
import Loading from "../Loading";

import useWindowSize from "../../utils/useWindowSize";
import Protected from "../Protected";

//media
import noData from "../../assets/undraw_towing_-6-yy4.svg";

const ProductScreen = (props) => {
    const location = useLocation();
    const model = location.pathname.split("/")[2];

    //redux stuff
    const user = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.userPreferences);
    const { authToken, userInfo } = user;

    const [isLoading, setIsLoading] = useState(false);
    const [cars, setCars] = useState([]);
    const [kits, setKits] = useState([]);
    const [bagKits, setBagKits] = useState([]);
    const [avaiableCondition, setAvaiableCondition] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState("");
    const [priceInfo, setPriceInfo] = useState({});
    const [rentSuccess, setRentSuccess] = useState(false);

    const width = useWindowSize();

    useEffect(() => {
        const fetchCars = async () => {
            const searchQuery = queryString.parse(location.search);
            var searchObj = {};
            //deve vedere la disponibilita'
            if (authToken) { 
                if (searchQuery.type === "period") {
                    searchObj = {
                        type: "period",
                        from: searchQuery.from,
                        to: searchQuery.to,
                        since: searchQuery.since,
                        singleDay: searchQuery.singleDay,
                        for: searchQuery.for,
                    };
                } else {
                    searchObj = {
                        type: "classic",
                        from: searchQuery.from,
                        to: searchQuery.to,
                    };
                }
                searchObj.checkAvaiability = true;
            }

            searchObj.place = searchQuery.place;

            try {
                setIsLoading(true);
                const { data } = await axios.get("/api/cars", {
                    params: { ...searchObj },
                });
                if (data.data.length > 0) {
                    let modelCars = data.data.filter(
                        (car) => car.model === model
                    );

                    if (modelCars.length > 0) {
                        setCars(modelCars);
                    } else {
                        setCars([]);
                    }
                } else {
                    setCars([]);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setCars([]);
            }
        };

        fetchCars();
    }, [model, location.search, authToken]);

    useEffect(() => {
        if (cars.length > 0) {
            let condition = [];
            cars.forEach((car) => {
                if (!condition.includes(car.condition))
                    condition.push(car.condition);
            });
            setAvaiableCondition(condition);
        }
    }, [cars]);

    useEffect(() => {
        const fetchKits = async () => {
            try {
                const { data } = await axios.get("/api/kits");
                if (data.data.length > 0) {
                    setKits(data.data);
                } else {
                    setKits([]);
                }
            } catch (error) {
                setKits([]);
            }
        };

        fetchKits();
    }, []);

    useEffect(() => {
        const updatePrice = async () => {
            const searchQuery = queryString.parse(location.search);
            var searchObj = {};
            if (searchQuery.type === "period") {
                searchObj = {
                    type: "period",
                    from: searchQuery.from,
                    to: searchQuery.to,
                    since: searchQuery.since,
                    singleDay: searchQuery.singleDay,
                    for: searchQuery.for,
                };
            } else {
                searchObj = {
                    type: "classic",
                    from: searchQuery.from,
                    to: searchQuery.to,
                };
            }

            searchObj.kits = "";
            if (bagKits.length > 0) {
                bagKits.forEach((kitIn, i) => {
                    searchObj.kits += `${
                        kits.filter((kit) => kit._id === kitIn)[0].price
                    }`;
                    if (i < bagKits.length - 1) searchObj.kits += ";";
                });
            }

            let carId = cars.filter(
                (car) => car.condition === selectedCondition
            )[0]._id;
            try {
                const { data } = await axios.get(
                    `/api/rents/getPrice/${carId}`,
                    {
                        params: { ...searchObj },
                    }
                );
                setPriceInfo(data.data);
            } catch (error) {
                setPriceInfo({});
            }
        };

        if (selectedCondition) updatePrice();
    }, [bagKits, selectedCondition, kits, location.search, cars]);

    const requestRent = async () => {
        const searchQuery = queryString.parse(location.search);
            var rent = {};
            if (searchQuery.type === "period") {
                rent = {
                    type: "period",
                    period: {
                        from: searchQuery.from,
                        to: searchQuery.to,
                        since: searchQuery.since,
                        singleDay: searchQuery.singleDay,
                        for: searchQuery.for,
                    }
                    
                };
            } else {
                rent = {
                    type: "classic",
                    classic: {
                        from: searchQuery.from,
                        to: searchQuery.to,
                    }
                };
            }

            rent.rentObj = {}
            rent.rentObj.car = cars.filter(
                (car) => car.condition === selectedCondition
            )[0]._id;

            if (bagKits.length > 0) {
                rent.rentObj.kits = []
                bagKits.forEach((kitIn, i) => {
                    rent.rentObj.kits.push(kitIn)
                });

                rent.rentObj.kits = rent.rentObj.kits.join(";") //bisogna mandarlo come stringa

            }

            rent.customer = userInfo._id;

        try {
            setIsLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              };
            await axios.post('/api/rents/', rent, config)
            setIsLoading(false)
            setRentSuccess(true);
        } catch (error) {
            setIsLoading(false)
            message.error({
                content: <span role="alert">{error.response.data.error}</span>,
                duration: 5,
            });
        }
    }

    return (
        <Protected history={props.history}>
            {(authToken && !rentSuccess) ? (
                <div
                    style={{ minHeight: "calc(100vh - 5rem)" }}
                    className="py-16 pt-8 relative"
                >
                    <Loading loading={isLoading}>
                        <div>
                            {cars.length > 0 ? (
                                <div className="container px-4 mx-auto">
                                    {/* Titolo */}
                                    <PageHeader
                                        onBack={() =>
                                            props.history.push(
                                                `/catalog${location.search}`
                                            )
                                        }
                                        title="Pagina noleggio"
                                    />

                                    <br />

                                    {/* Foto + descrizione */}
                                    <div className="flex gap-x-20 gap-y-10 flex-col lg:flex-row">
                                        <div>
                                            <div className="bg-neutral border rounded">
                                                <img
                                                    className="w-full h-full object-contain"
                                                    src={cars[0].image}
                                                    alt={`Immagine del modello ${cars[0].model}`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Space
                                                direction="vertical"
                                                size={20}
                                            >
                                                <div>
                                                    <h2
                                                        style={{
                                                            fontSize:
                                                                "calc(20px + 0.7vw)",
                                                            margin: "0",
                                                        }}
                                                    >
                                                        {cars[0].model}
                                                    </h2>
                                                    <h3
                                                        style={{
                                                            fontSize:
                                                                "calc(15px + 0.4vw)",
                                                            margin: "0",
                                                        }}
                                                    >
                                                        <span className="text-base-content text-opacity-50">
                                                            {cars[0].brand}
                                                        </span>
                                                    </h3>
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className="flex gap-2 items-center border p-2">
                                                        <p
                                                            style={{
                                                                margin: "0",
                                                                minWidth:
                                                                    "7rem",
                                                            }}
                                                            className="font-medium w-1/5 tracking-tight"
                                                        >
                                                            Tipologia motore:
                                                        </p>
                                                        <p
                                                            className="tracking-tight text-sm"
                                                            style={{
                                                                margin: "0",
                                                            }}
                                                        >
                                                            {cars[0].isElectric
                                                                ? "Elettrico"
                                                                : "Benzina"}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 items-center border p-2">
                                                        <p
                                                            style={{
                                                                margin: "0",
                                                                minWidth:
                                                                    "7rem",
                                                            }}
                                                            className="font-medium w-1/5 tracking-tight"
                                                        >
                                                            Numero porte:
                                                        </p>
                                                        <p
                                                            className="text-sm tracking-tight"
                                                            style={{
                                                                margin: "0",
                                                            }}
                                                        >
                                                            {cars[0]
                                                                .hasThreeDoors
                                                                ? "3"
                                                                : "5"}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2 items-center border p-2">
                                                        <p
                                                            style={{
                                                                margin: "0",
                                                                minWidth:
                                                                    "7rem",
                                                            }}
                                                            className="font-medium w-1/5 tracking-tight"
                                                        >
                                                            Tipologia cambio:
                                                        </p>
                                                        <p
                                                            className="text-sm tracking-tight"
                                                            style={{
                                                                margin: "0",
                                                            }}
                                                        >
                                                            {cars[0]
                                                                .hasAutomaticTransmission
                                                                ? "Automatico"
                                                                : "Manuale"}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2 items-center border p-2">
                                                        <p
                                                            style={{
                                                                margin: "0",
                                                                minWidth:
                                                                    "7rem",
                                                            }}
                                                            className="font-medium w-1/5 tracking-tight"
                                                        >
                                                            Numero sedili:
                                                        </p>
                                                        <p
                                                            className="text-sm tracking-tight"
                                                            style={{
                                                                margin: "0",
                                                            }}
                                                        >
                                                            {cars[0].seats}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2 items-center border p-2">
                                                        <p
                                                            style={{
                                                                margin: "0",
                                                                minWidth:
                                                                    "7rem",
                                                            }}
                                                            className="font-medium w-1/5 tracking-tight"
                                                        >
                                                            Valigie
                                                            trasportabili:
                                                        </p>
                                                        <p
                                                            className="text-sm tracking-tight"
                                                            style={{
                                                                margin: "0",
                                                            }}
                                                        >
                                                            {
                                                                cars[0]
                                                                    .baggageSize
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="max-w-xl">
                                                    <p className="font-medium tracking-tight text-base">
                                                        Descrizione
                                                    </p>
                                                    <p className="tracking-tight text-sm">
                                                        {cars[0].description}
                                                    </p>
                                                </div>
                                            </Space>
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Kits */}

                                    {kits.length > 0 && (
                                        <div>
                                            <h2
                                                style={{
                                                    fontSize:
                                                        "calc(15px + 0.4vw)",
                                                    margin: "0",
                                                }}
                                            >
                                                Noleggialo con
                                            </h2>
                                            <br />
                                            <Splide
                                                style={{ height: "22rem" }}
                                                options={{
                                                    i18n: {
                                                        prev: "Vai alla slide precedente",
                                                        next: "Vai alla slide successiva",
                                                        first: "Vai alla prima slide",
                                                        last: "Vai all'ultima slide",
                                                        slideX: "Vai a questa slide.",
                                                        pageX: "Vai a questa pagina.",
                                                    },
                                                    perPage: 4,
                                                    rewind: true,
                                                    gap: "1rem",
                                                    breakpoints: {
                                                        600: {
                                                            perPage: 1,
                                                        },
                                                        1024: {
                                                            perPage: 2,
                                                        },
                                                        1350: {
                                                            perPage: 3,
                                                        },
                                                    },
                                                }}
                                            >
                                                {kits.map((kit, i) => (
                                                    <SplideSlide key={"slide" + i}>
                                                        <div
                                                            className="h-96 p-4"
                                                            key={kit._id}
                                                        >
                                                            <div className="w-full h-4/5">
                                                                <img
                                                                    className="w-full h-full object-contain"
                                                                    src={
                                                                        kit.image
                                                                    }
                                                                    alt={`Immagine ${kit.name}`}
                                                                />
                                                            </div>

                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p
                                                                        style={{
                                                                            margin: "0",
                                                                        }}
                                                                        className="font-medium md:text-xl tracking-tight"
                                                                    >
                                                                        {
                                                                            kit.name
                                                                        }
                                                                    </p>
                                                                    <p
                                                                        style={{
                                                                            margin: "0",
                                                                        }}
                                                                    >
                                                                        <span className="font-medium md:text-xl">
                                                                            {
                                                                                kit.price
                                                                            }
                                                                            €
                                                                        </span>
                                                                        <span>
                                                                            /
                                                                            ora
                                                                        </span>
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <button
                                                                        onClick={() => {
                                                                            if (
                                                                                !bagKits.includes(
                                                                                    kit._id
                                                                                )
                                                                            )
                                                                                setBagKits(
                                                                                    (
                                                                                        bagKits
                                                                                    ) => [
                                                                                        ...bagKits,
                                                                                        kit._id,
                                                                                    ]
                                                                                );
                                                                            else {
                                                                                let tmp =
                                                                                    bagKits.filter(
                                                                                        (
                                                                                            id
                                                                                        ) =>
                                                                                            id !==
                                                                                            kit._id
                                                                                    );
                                                                                setBagKits(
                                                                                    tmp
                                                                                );
                                                                            }
                                                                        }}
                                                                        aria-label={
                                                                            bagKits.includes(
                                                                                kit._id
                                                                            )
                                                                                ? `Clicca per rimuovere ${kit.name}.`
                                                                                : `Clicca per aggiungere ${kit.name}.`
                                                                        }
                                                                        className={`btn ${
                                                                            width <
                                                                                400 &&
                                                                            "btn-circle"
                                                                        } ${
                                                                            bagKits.includes(
                                                                                kit._id
                                                                            )
                                                                                ? "btn-error"
                                                                                : "btn-success"
                                                                        }`}
                                                                        type="button"
                                                                    >
                                                                        {width >=
                                                                            400 && (
                                                                            <span className="text-white">
                                                                                {bagKits.includes(
                                                                                    kit._id
                                                                                )
                                                                                    ? `Rimuovi`
                                                                                    : `Aggiungi`}
                                                                            </span>
                                                                        )}
                                                                        {width <
                                                                            400 && (
                                                                            <span className="text-white">
                                                                                {bagKits.includes(
                                                                                    kit._id
                                                                                )
                                                                                    ? `–`
                                                                                    : `＋`}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SplideSlide>
                                                ))}
                                            </Splide>
                                        </div>
                                    )}

                                    <Divider />

                                    {/* Versione */}

                                    <div>
                                        <h2
                                            style={{
                                                fontSize: "calc(15px + 0.4vw)",
                                                margin: "0",
                                            }}
                                        >
                                            Scegli la versione
                                        </h2>
                                        <br />

                                        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 gap-y-4">
                                            <button
                                                role="checkbox"
                                                aria-checked={
                                                    selectedCondition ===
                                                    "perfect"
                                                }
                                                aria-label="Scegli se selezionare un modello nuovo. Questo modello di auto è stato immatricolato di recente, ha viaggiato pochi kilometri e non ha mai avuto danni di alcun tipo. Perfetto se non si basa a spese."
                                                className={`h-56 rounded shadow-md p-4 w-full disabled:opacity-50 text-left ${
                                                    selectedCondition ===
                                                    "perfect"
                                                        ? "bg-success text-white"
                                                        : "bg-base-300"
                                                } relative`}
                                                disabled={
                                                    avaiableCondition &&
                                                    !avaiableCondition.includes(
                                                        "perfect"
                                                    )
                                                }
                                                onClick={() => {
                                                    if (
                                                        selectedCondition ===
                                                        "perfect"
                                                    )
                                                        setSelectedCondition(
                                                            ""
                                                        );
                                                    else
                                                        setSelectedCondition(
                                                            "perfect"
                                                        );
                                                }}
                                            >
                                                <h3 className={`text-xl`}>
                                                    <span
                                                        className={`${
                                                            selectedCondition ===
                                                                "perfect" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        Modello nuovo
                                                    </span>
                                                </h3>
                                                <p className="max-w-xs h-2/3">
                                                    <span
                                                        className={`${
                                                            selectedCondition ===
                                                                "perfect" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        Questo modello di auto è
                                                        stato immatricolato di
                                                        recente, ha viaggiato
                                                        pochi kilometri e non ha
                                                        mai avuto danni di alcun
                                                        tipo. Perfetto se non si
                                                        basa a spese.
                                                    </span>
                                                </p>
                                                {selectedCondition ===
                                                    "perfect" && (
                                                    <span
                                                        className={`absolute bottom-5 right-5 ${
                                                            selectedCondition ===
                                                                "perfect" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        <i className="bi bi-check-square text-2xl"></i>
                                                    </span>
                                                )}

                                                {selectedCondition !==
                                                    "perfect" && (
                                                    <span
                                                        className={`absolute bottom-5 right-5 ${
                                                            selectedCondition ===
                                                                "perfect" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        <i className="bi bi-square text-2xl"></i>
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                role="checkbox"
                                                aria-checked={
                                                    selectedCondition === "good"
                                                }
                                                aria-label="Scegli se selezionare un modello usato. Questo modello di auto è stato immatricolato da qualche anno, ha viaggiato migliaia di kilometri ed è stato necessario ripararlo alcune volte. Perfetto se cerchi sicurezza e risparmio."
                                                className={`h-56 rounded shadow-md p-4 w-full disabled:opacity-50 text-left ${
                                                    selectedCondition === "good"
                                                        ? "bg-success text-white"
                                                        : "bg-base-300"
                                                } relative`}
                                                disabled={
                                                    avaiableCondition &&
                                                    !avaiableCondition.includes(
                                                        "good"
                                                    )
                                                }
                                                onClick={() => {
                                                    if (
                                                        selectedCondition ===
                                                        "good"
                                                    )
                                                        setSelectedCondition(
                                                            ""
                                                        );
                                                    else
                                                        setSelectedCondition(
                                                            "good"
                                                        );
                                                }}
                                            >
                                                <h3 className={`text-xl`}>
                                                    <span
                                                        className={`${
                                                            selectedCondition ===
                                                                "good" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        Modello usato
                                                    </span>
                                                </h3>
                                                <p className="max-w-xs h-2/3">
                                                    <span
                                                        className={`${
                                                            selectedCondition ===
                                                                "good" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        Questo modello di auto è
                                                        stato immatricolato da
                                                        qualche anno, ha
                                                        viaggiato migliaia di
                                                        kilometri ed è stato
                                                        necessario riparlarlo
                                                        alcune volte. Perfetto
                                                        se cerchi sicurezza e
                                                        risparmio.
                                                    </span>
                                                </p>
                                                {selectedCondition ===
                                                    "good" && (
                                                    <span
                                                        className={`absolute bottom-5 right-5 ${
                                                            selectedCondition ===
                                                                "good" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        <i className="bi bi-check-square text-2xl"></i>
                                                    </span>
                                                )}

                                                {selectedCondition !==
                                                    "good" && (
                                                    <span
                                                        className={`absolute bottom-5 right-5 ${
                                                            selectedCondition ===
                                                                "good" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        <i className="bi bi-square text-2xl"></i>
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                role="checkbox"
                                                aria-checked={
                                                    selectedCondition === "weak"
                                                }
                                                aria-label="Scegli se selezionare un modello usurato. Questo modello di auto è piuttosto vecchio, ha viaggiato molti kilometri ed ha ricevuto danni. Perfetto se si cerca il risparmio."
                                                className={`h-56 rounded shadow-md p-4 w-full disabled:opacity-50 text-left ${
                                                    selectedCondition === "weak"
                                                        ? "bg-success"
                                                        : "bg-base-300"
                                                } relative`}
                                                disabled={
                                                    avaiableCondition &&
                                                    !avaiableCondition.includes(
                                                        "weak"
                                                    )
                                                }
                                                onClick={() => {
                                                    if (
                                                        selectedCondition ===
                                                        "weak"
                                                    )
                                                        setSelectedCondition(
                                                            ""
                                                        );
                                                    else
                                                        setSelectedCondition(
                                                            "weak"
                                                        );
                                                }}
                                            >
                                                <h3 className={`text-xl`}>
                                                    <span
                                                        className={`${
                                                            selectedCondition ===
                                                                "weak" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        Modello usurato
                                                    </span>
                                                </h3>
                                                <p className="max-w-xs h-2/3">
                                                    <span
                                                        className={`${
                                                            selectedCondition ===
                                                                "weak" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        Questo modello di auto è
                                                        piuttosto vecchio, ha
                                                        viaggiato molti
                                                        kilometri ed ha ricevuto
                                                        danni. Perfetto se si
                                                        cerca il risparmio.
                                                    </span>
                                                </p>
                                                {selectedCondition ===
                                                    "weak" && (
                                                    <span
                                                        className={`absolute bottom-5 right-5 ${
                                                            selectedCondition ===
                                                                "weak" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        <i className="bi bi-check-square text-2xl"></i>
                                                    </span>
                                                )}

                                                {selectedCondition !==
                                                    "weak" && (
                                                    <span
                                                        className={`absolute bottom-5 right-5 ${
                                                            selectedCondition ===
                                                                "weak" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                        <i className="bi bi-square text-2xl"></i>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <br />

                                    {selectedCondition && (
                                        <>
                                            <Divider />
                                            <div>
                                                <h2
                                                    style={{
                                                        fontSize:
                                                            "calc(15px + 0.4vw)",
                                                        margin: "0",
                                                    }}
                                                >
                                                    Checkout
                                                </h2>
                                                <br />

                                                {/* Checkout */}
                                                <List
                                                    size="small"
                                                    bordered
                                                    style={{
                                                        borderColor: `${
                                                            theme === "dark"
                                                                ? "#fff"
                                                                : "#ccc"
                                                        }`,
                                                        paddingTop: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    header={
                                                        <div>
                                                            <div className="font-medium text-base">
                                                                Riepilogo
                                                                noleggio
                                                            </div>
                                                        </div>
                                                    }
                                                    footer={
                                                        <div>
                                                            {" "}
                                                            <hr /> <br />
                                                            {priceInfo && (
                                                                <div>
                                                                    <p
                                                                        className="font-medium text-base"
                                                                        style={{
                                                                            margin: "0",
                                                                        }}
                                                                    >
                                                                        Prezzo
                                                                        finale
                                                                    </p>
                                                                    <br />
                                                                    <Space
                                                                        size={
                                                                            10
                                                                        }
                                                                        direction="vertical"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <p
                                                                                style={{
                                                                                    margin: "0",
                                                                                    minWidth:
                                                                                        "7rem",
                                                                                }}
                                                                                className="font-medium tracking-tight"
                                                                            >
                                                                                Prezzo
                                                                                base
                                                                            </p>
                                                                            <p
                                                                                style={{
                                                                                    margin: "0",
                                                                                }}
                                                                            >
                                                                                +{" "}
                                                                                {
                                                                                    priceInfo.modelPrice
                                                                                }
                                                                                €{" "}
                                                                                <span className="text-xs">
                                                                                    /ora
                                                                                </span>
                                                                            </p>
                                                                        </div>

                                                                        <div className="flex items-center gap-2">
                                                                            <p
                                                                                style={{
                                                                                    margin: "0",
                                                                                    minWidth:
                                                                                        "7rem",
                                                                                }}
                                                                                className="font-medium tracking-tight"
                                                                            >
                                                                                Prezzo
                                                                                kits
                                                                            </p>
                                                                            <p
                                                                                style={{
                                                                                    margin: "0",
                                                                                }}
                                                                            >
                                                                                +{" "}
                                                                                {bagKits.length >
                                                                                0 ? (
                                                                                    <>
                                                                                        {
                                                                                            priceInfo.kitsPrice
                                                                                        }
                                                                                        €{" "}
                                                                                        <span className="text-xs">
                                                                                            /ora
                                                                                        </span>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        0
                                                                                    </>
                                                                                )}
                                                                            </p>
                                                                        </div>

                                                                        <div className="flex items-center gap-2">
                                                                            <p
                                                                                style={{
                                                                                    margin: "0",
                                                                                    minWidth:
                                                                                        "7rem",
                                                                                }}
                                                                                className="font-medium tracking-tight"
                                                                            >
                                                                                <span className="text-success">
                                                                                    Sconti
                                                                                </span>
                                                                            </p>
                                                                            <p
                                                                                style={{
                                                                                    margin: "0",
                                                                                }}
                                                                            >
                                                                                <span className="text-success">
                                                                                    -{" "}
                                                                                    {priceInfo.discount?.toFixed(
                                                                                        2
                                                                                    )}{" "}
                                                                                    €
                                                                                </span>
                                                                            </p>
                                                                        </div>

                                                                        <div className="flex items-center gap-2">
                                                                            <p
                                                                                style={{
                                                                                    margin: "0",
                                                                                    minWidth:
                                                                                        "7rem",
                                                                                }}
                                                                                className="font-medium text-2xl tracking-tight"
                                                                            >
                                                                                Totale
                                                                            </p>
                                                                            <p
                                                                                style={{
                                                                                    margin: "0",
                                                                                }}
                                                                                className="font-medium text-xl tracking-tight"
                                                                            >
                                                                                {
                                                                                    priceInfo.finalPrice?.toFixed(
                                                                                        2
                                                                                    )
                                                                                }{" "}
                                                                                €
                                                                            </p>
                                                                        </div>
                                                                    </Space>

                                                                    <div className="relative flex mt-8">
                                                                        <div className="relative w-full sm:w-auto">
                                                                            <div className=" bg-gradient-to-r from-accent to-primary absolute -inset-1 rounded-lg filter blur w-full sm:w-auto"></div>
                                                                            <button
                                                                                onClick={requestRent}
                                                                                type="button"
                                                                                aria-label="Clicca per confermare il noleggio"
                                                                                className="btn btn-secondary btn-block sm:btn-wide z-20 relative"
                                                                            >
                                                                                <span className="text-secondary-content">
                                                                                    Noleggia
                                                                                </span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                    dataSource={[
                                                        `– ${model}, versione ${
                                                            selectedCondition ===
                                                            "Perfect"
                                                                ? "nuova"
                                                                : selectedCondition ===
                                                                  "good"
                                                                ? "usata"
                                                                : "usurata"
                                                        }`,
                                                        ...bagKits.map(
                                                            (_id) =>
                                                                "– " +
                                                                kits.filter(
                                                                    (kit) =>
                                                                        kit._id ===
                                                                        _id
                                                                )[0].name
                                                        ),
                                                    ]}
                                                    renderItem={(item) => (
                                                        <List.Item>
                                                            <span className="">
                                                                {item}
                                                            </span>
                                                        </List.Item>
                                                    )}
                                                />

                                                <br />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center relative flex-col w-3/5 mt-20 mx-auto">
                                    <img
                                        style={{ maxWidth: "50rem" }}
                                        className="w-full h-full object-contain"
                                        src={noData}
                                        alt="Nessun risultato trovato"
                                    />
                                    <div
                                        style={{
                                            fontSize: "calc(15px + 1.3vw)",
                                        }}
                                        className=" w-full text-center max-w-2xl font-bold"
                                    >
                                        {cars.length === 0 && (
                                            <p>
                                                Spiacenti, non sono stati
                                                trovati risultati per la tua
                                                ricerca.
                                            </p>
                                        )}
                                    </div>

                                    <Link to="/">
                                        <button
                                            aria-label="Clicca per tornare alla home"
                                            className="btn btn-secondary"
                                        >
                                            <span className="text-secondary-content">
                                                Torna alla home
                                            </span>
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Loading>
                </div>
            ) : (authToken && rentSuccess) && (<div className="min-h-screen flex justify-center items-center">
                <Result
                style={{color: theme === "dark" ? "#00bda0" : "#009485"}}
                status="success"
                title="Richiesta di noleggio avvenuta con successo."
                subTitle="Controlla la tua pagina dei noleggi per vedere quando sarà confermato da un nostro amministratore."
                extra={[
                <Link to="/">
                    <button className="btn btn-secondary" type="button">
                        <span className="text-secondary-content">Torna alla home</span>
                    </button>
                </Link>
                ]}
            />
            </div>)}
        </Protected>
    );
};

export default ProductScreen;

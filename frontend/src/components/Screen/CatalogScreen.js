import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import queryString from "query-string";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

//componenti
import CardCar from "../CardCar";
import Loading from "../Loading";
import { Dropdown, InputNumber, Select } from "antd";
import useWindowSize from "../../utils/useWindowSize";

//media
import noData from "../../assets/undraw_towing_-6-yy4.svg";

const CatalogScreen = () => {
    const location = useLocation();

    //redux stuff
    const user = useSelector((state) => state.user);
    const { authToken, userInfo } = user;

    const [isLoading, setIsLoading] = useState(false);
    const [cars, setCars] = useState([]);
    const [carsShowed, setCarsShowed] = useState([]);
    const [orderBy, setOrderBy] = useState("preferences");
    const [filterObj, setFilterObj] = useState({});
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [orderyByOpen, setOrderByOpen] = useState(false);

    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const width = useWindowSize();

    useEffect(() => {
        const fetchCars = async () => {
            const searchQuery = queryString.parse(location.search);
            var searchObj = {};
            if (authToken) {
                if (searchQuery.type === "period") {
                    searchObj = {
                        //rentRequest: true,
                        type: "period",
                        from: searchQuery.from,
                        to: searchQuery.to,
                        since: searchQuery.since,
                        singleDay: searchQuery.singleDay,
                        for: searchQuery.for,
                    };
                } else {
                    searchObj = {
                        //rentRequest: true,
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
                    setCars(data.data);
                    let min = Number.POSITIVE_INFINITY;
                    let max = Number.NEGATIVE_INFINITY;

                    for (let i = 0; i < data.data.length; i++) {
                        const car = data.data[i];
                        if (car.basePrice < min) min = car.basePrice;
                        else if (car.basePrice > max) max = car.basePrice;
                    }
                    setMinPrice(min);
                    setMaxPrice(max);
                    sameModels(data.data);
                } else {
                    setCars([]);
                    setCarsShowed([]);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setCars([]);
                setCarsShowed([]);
            }
        };

        fetchCars();
    }, [authToken, location.search]);

    //mostra solo un auto per modello
    const sameModels = (cars) => {
        let map = new Map();
        if (cars.length > 0) {
            cars.forEach((car) => {
                if (!map.has(car.model)) map.set(car.model, car);
            });
        }
        setCarsShowed(Array.from(map.values()));
    };

    useEffect(() => {
        //se ci sono macchine
        if (cars.length > 0) {
            //le filtra
            let toFilter = cars;
            if (filterObj.fuelType === "electric")
                toFilter = toFilter.filter((car) => car.isElectric);
            if (filterObj.fuelType === "normal")
                toFilter = toFilter.filter((car) => !car.isElectric);
            if (filterObj.seats)
                toFilter = toFilter.filter(
                    (car) => car.seats === filterObj.seats
                );
            if (filterObj.transmission === "auto")
                toFilter = toFilter.filter(
                    (car) => car.hasAutomaticTransmission
                );
            if (filterObj.transmission === "manual")
                toFilter = toFilter.filter(
                    (car) => !car.hasAutomaticTransmission
                );
            if (filterObj.minPrice)
                toFilter = toFilter.filter(
                    (car) => car.basePrice >= filterObj.minPrice
                );
            if (filterObj.maxPrice)
                toFilter = toFilter.filter(
                    (car) => car.basePrice <= filterObj.maxPrice
                );

            //se e' sopravvissuta qualcuna
            if (toFilter.length > 0) {
                //le ordina
                let toSort = toFilter;
                switch (orderBy) {
                    case "preferences":
                        toSort = toSort.sort((a, b) => {
                            if (
                                userInfo?.preferences?.includes(
                                    a.tag.toLowerCase()
                                )
                            ) {
                                return -1;
                            } else if (
                                userInfo?.preferences?.includes(
                                    b.tag.toLowerCase()
                                )
                            ) {
                                return 1;
                            } else return 0;
                        });
                        setCarsShowed(toSort);
                        break;
                    case "lower":
                        toSort = toSort.sort((a, b) => {
                            return a.basePrice - b.basePrice;
                        });
                        setCarsShowed(toSort);
                        break;
                    case "higher":
                        toSort = toSort.sort((a, b) => {
                            return b.basePrice - a.basePrice;
                        });
                        setCarsShowed(toSort);
                        break;
                    default:
                        break;
                }

                sameModels(toSort);
            } else {
                sameModels([]);
            }
        }
    }, [filterObj, cars, orderBy, userInfo]);

    return (
        <div
            style={{ minHeight: "calc(100vh - 5rem)" }}
            className="px-4 py-16 relative"
        >
            <Loading loading={isLoading}>
                <div>

                    {/* Bottone filtri */}
                    {cars.length > 0 && (
                        <div className="sm:hidden flex justify-end">
                            <button
                                className="btn btn-square btn-xl btn-secondary"
                                onClick={() =>
                                    setFilterPanelOpen(
                                        (filterPanelOpen) => !filterPanelOpen
                                    )
                                }
                                type="button"
                            >
                                <i
                                    className={`bi bi-${
                                        filterPanelOpen ? "x-lg" : "gear-fill"
                                    } text-secondary-content text-xl`}
                                ></i>
                            </button>
                        </div>
                    )}

                    {/* Filtri */}
                    {(width >= 640 || filterPanelOpen) && cars.length > 0 && (
                        <div className="flex justify-center flex-col sm:flex-row max-w-4xl items-center mx-auto gap-2">
                            <div style={{ minWidth: "4rem" }}>Filtra per</div>

                            <div className="w-full">
                                <div className="border rounded">
                                    <Select
                                        value={filterObj.seats}
                                        placeholder="Posti a sedere"
                                        aria-label="Decidi i posti a sedere che deve avere la tua auto"
                                        style={{ width: "100%" }}
                                        onChange={(val) =>
                                            setFilterObj((filterObj) => {
                                                if (val === "none")
                                                    return {
                                                        ...filterObj,
                                                        seats: undefined,
                                                    };
                                                else
                                                    return {
                                                        ...filterObj,
                                                        seats: val,
                                                    };
                                            })
                                        }
                                        allowClear
                                    >
                                        <Select.Option value="none">
                                            Qualsiasi
                                        </Select.Option>
                                        <Select.Option value={2}>
                                            2
                                        </Select.Option>
                                        <Select.Option value={4}>
                                            4
                                        </Select.Option>
                                        <Select.Option value={5}>
                                            5
                                        </Select.Option>
                                    </Select>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="border rounded">
                                    <Select
                                        value={filterObj.transmission}
                                        placeholder="Trasmissione"
                                        aria-label="Decidi il tipo di trasmissione della tua auto"
                                        style={{ width: "100%" }}
                                        onChange={(val) => {
                                            if (val === "none")
                                                return setFilterObj(
                                                    (filterObj) => {
                                                        return {
                                                            ...filterObj,
                                                            transmission:
                                                                undefined,
                                                        };
                                                    }
                                                );
                                            setFilterObj((filterObj) => {
                                                return {
                                                    ...filterObj,
                                                    transmission: val,
                                                };
                                            });
                                        }}
                                        allowClear
                                    >
                                        <Select.Option value="none">
                                            Qualsiasi
                                        </Select.Option>
                                        <Select.Option value="manual">
                                            Manuale
                                        </Select.Option>
                                        <Select.Option value="auto">
                                            Automatica
                                        </Select.Option>
                                    </Select>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="border rounded">
                                    <Select
                                        value={filterObj.fuelType}
                                        placeholder="Motore"
                                        aria-label="Decidi il tipo di motore della tua auto"
                                        style={{ width: "100%" }}
                                        onChange={(val) => {
                                            if (val === "none")
                                                return setFilterObj(
                                                    (filterObj) => {
                                                        return {
                                                            ...filterObj,
                                                            fuelType: undefined,
                                                        };
                                                    }
                                                );
                                            setFilterObj((filterObj) => {
                                                return {
                                                    ...filterObj,
                                                    fuelType: val,
                                                };
                                            });
                                        }}
                                        allowClear
                                    >
                                        <Select.Option value="none">
                                            Qualsiasi
                                        </Select.Option>
                                        <Select.Option value="normal">
                                            Benzina
                                        </Select.Option>
                                        <Select.Option value="electric">
                                            Elettrico
                                        </Select.Option>
                                    </Select>
                                </div>
                            </div>

                            <div className="w-full flex gap-2">
                                <div className="border rounded w-full">
                                    <InputNumber
                                        value={filterObj.minPrice || minPrice}
                                        style={{ width: "100%" }}
                                        placeholder="Min €"
                                        aria-label="Prezzo minimo"
                                        min={minPrice}
                                        defaultValue={minPrice}
                                        formatter={(val) => `Da ${val}€`}
                                        max={filterObj.maxPrice || maxPrice}
                                        onChange={(val) =>
                                            setFilterObj((filterObj) => {
                                                return {
                                                    ...filterObj,
                                                    minPrice: val,
                                                };
                                            })
                                        }
                                    />
                                </div>

                                <div className="border rounded w-full">
                                    <InputNumber
                                        value={filterObj.maxPrice || maxPrice}
                                        style={{ width: "100%" }}
                                        placeholder="Max €"
                                        aria-label="Prezzo massimo"
                                        min={filterObj.minPrice || minPrice}
                                        max={maxPrice}
                                        defaultValue={maxPrice}
                                        formatter={(val) => `A ${val}€`}
                                        onChange={(val) =>
                                            setFilterObj((filterObj) => {
                                                return {
                                                    ...filterObj,
                                                    maxPrice: val,
                                                };
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <br />

                    {/* Macchine */}
                    <div className="flex flex-wrap w-full gap-8">
                        {carsShowed.length > 0 &&
                            carsShowed.map((car) => (
                                <CardCar key={car.model} car={car} />
                            ))}
                    </div>

                     {/* Sort */}
                     {cars.length > 0 && (
                        <div className="fixed bottom-10 right-10 z-10">
                            <Dropdown
                                onVisibleChange={(visible) =>
                                    setOrderByOpen(visible)
                                }
                                visible={orderyByOpen}
                                trigger={["click"]}
                                placement="topRight"
                                getPopupContainer={() => document.getElementById("drop-down-catalog-container")}
                                overlay={
                                    <div
                                        className="flex flex-col w-52 bg-base-300 shadow-md"
                                        
                                    >
                                        <div id="order-by-menu">
                                        <button
                                            aria-label="Clicca per ordinare in base ai consigliati."
                                            onClick={() =>
                                                setOrderBy("preferences")
                                            }
                                            type="button"
                                            className={`w-full text-left p-3 ${
                                                orderBy === "preferences" &&
                                                "bg-primary bg-opacity-20"
                                            }`}
                                        >
                                            Ordina per consigliati
                                        </button>
                                        <button
                                            aria-label="Clicca per ordinare con prezzo crescente."
                                            onClick={() => setOrderBy("lower")}
                                            type="button"
                                            className={`w-full text-left p-3 ${
                                                orderBy === "lower" &&
                                                "bg-primary bg-opacity-20"
                                            }`}
                                        >
                                            Ordina per prezzo minore
                                        </button>
                                        <button
                                            aria-label="Clicca per ordinare con prezzo decrescente."
                                            onClick={() => setOrderBy("higher")}
                                            type="button"
                                            className={`w-full text-left p-3 ${
                                                orderBy === "higher" &&
                                                "bg-primary bg-opacity-20"
                                            }`}
                                        >
                                            Ordina per prezzo maggiore
                                        </button>
                                        </div>
                                    </div>
                                }
                                
                            >
                                <button
                                    aria-label="Clicca per aprire menù ordinamento risultati."
                                    className="btn btn-secondary btn-circle"
                                >
                                    <i className="bi bi-arrow-down-up text-secondary-content text-xl"></i>
                                </button>
                            </Dropdown>

                            <div id="drop-down-catalog-container">
                                    
                                </div>
                        </div>
                    )}

                    {/* No data */}
                    <div>
                        {carsShowed.length === 0 && (
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
                                            Spiacenti, non sono stati trovati
                                            risultati per la tua ricerca.
                                        </p>
                                    )}

                                    {cars.length > 0 && (
                                        <p>
                                            Spiacenti, non sono stati trovati
                                            risultati per i tuoi filtri.
                                        </p>
                                    )}
                                </div>
                                {cars.length === 0 && (
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
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Loading>
        </div>
    );
};

export default CatalogScreen;

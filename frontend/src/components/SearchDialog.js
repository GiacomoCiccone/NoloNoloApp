import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Select, Modal, DatePicker, TimePicker, InputNumber } from "antd";
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";

import Tooltip from "./Tooltip";

const SearchDialog = (props) => {
    const history = useHistory();

    //redux stuff
    const user = useSelector((state) => state.user);
    const { authToken } = user;

    //stato
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

    const [place, setPlace] = useState(null);
    const [options, setOptions] = useState([]);

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

    useEffect(() => {
        async function fetchPlace() {
            try {
                const { data } = await axios.get("/api/pickups/");
                setOptions(data.data);
            } catch (error) {
                setOptions([]);
            }
        }

        if (props.visible) {
            fetchPlace();
        }
    }, [props.visible]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!canSearch()) return;
        let searchObj = {};

        searchObj.place = place;

        if (!authToken) {
            history.push(`/catalog?place=${searchObj.place}`);
        } else {
            if (isPeriodic) {
                searchObj.type = "period";
                searchObj.period = {};
                searchObj.period.since = new Date(new Date(startDatePeriod).setHours(0,0,0,0));
                searchObj.period.from =
                    ((startDatePeriod.getDay() + 6) % 7) + 1;
                searchObj.period.to = searchObj.period.from;
                for (let i = 0; i < daysPeriod - 1; i++) {
                    searchObj.period.to = searchObj.period.to + 1;
                    if (searchObj.period.to === 8) {
                        searchObj.period.to = 1;
                    }
                }
                searchObj.period.for = weekPeriod;
                searchObj.period.singleDay =
                    searchObj.period.from === searchObj.period.to;
                history.push(
                    `/catalog?type=${searchObj.type}&since=${searchObj.period.since}&from=${searchObj.period.from}&to=${searchObj.period.to}&for=${searchObj.period.for}&singleDay=${searchObj.period.singleDay}&place=${searchObj.place}`
                );
            } else {
                searchObj.type = "classic";
                searchObj.classic = {};
                searchObj.classic.from = new Date(
                    startDate.setHours(new Date(startTime).getHours())
                );
                searchObj.classic.to = new Date(
                    endDate.setHours(new Date(endTime).getHours())
                );
                history.push(
                    `/catalog?type=${searchObj.type}&from=${searchObj.classic.from}&to=${searchObj.classic.to}&place=${searchObj.place}`
                );
            }
        }

        props.setVisible(false);
    };

    const canSearch = () => {
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

    return (
        <Modal
            title="Nuova ricerca di noleggio"
            centered
            visible={props.visible}
            okButtonProps={{ style: { display: "none" } }}
            onCancel={() => props.setVisible(false)}
            cancelText="Chiudi"
        >
            <form onSubmit={onSubmit}>
                {authToken ? (
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
                                        !isPeriodic && "text-primary-content"
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
                                        isPeriodic && "text-primary-content"
                                    }`}
                                >
                                    Periodico
                                </span>
                            </button>
                        </div>
                        <br />
                        <div>
                            <label
                                id="place-search-bar"
                                className="font-medium"
                            >
                                Seleziona un punto di ritiro
                            </label>
                            <div className="border mt-2">
                                <Select
                                    aria-labelledby="place-search-bar"
                                    style={{ width: "100%" }}
                                    placeholder="Aereoporto Fiumicino, Roma"
                                    onChange={(val) => setPlace(val)}
                                >
                                    {options.length > 0 &&
                                        options.map((option, i) => (
                                            <>
                                                <Select.Option
                                                    key={"place" + i}
                                                    value={option._id}
                                                    style={{ height: "40px" }}
                                                    aria-label={option.point}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        {option.point}{" "}
                                                        {option.type ===
                                                            "airport" && (
                                                            <img
                                                                width={30}
                                                                src="https://img.icons8.com/external-photo3ideastudio-gradient-photo3ideastudio/64/000000/external-airport-public-service-photo3ideastudio-gradient-photo3ideastudio.png"
                                                                alt="Tipologia di punto di ritiro: aereoporto."
                                                            />
                                                        )}
                                                        {option.type ===
                                                            "station" && (
                                                            <img
                                                                width={30}
                                                                src="https://img.icons8.com/nolan/64/train.png"
                                                                alt="Tipologia di punto di ritiro: stazione ferroviaria."
                                                            />
                                                        )}
                                                    </div>
                                                </Select.Option>
                                            </>
                                        ))}
                                </Select>
                            </div>
                        </div>
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
                                                        new Date().getDate() - 1
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
                                    {/* cerca auto - classico */}
                                    <input
                                        aria-disabled={!canSearch()}
                                        aria-label={`${
                                            !canSearch()
                                                ? "Riempi tutti i campi per effettuare una nuova ricerca."
                                                : "Cerca auto."
                                        }`}
                                        type="submit"
                                        value="Cerca auto"
                                        style={{ color: "#fff" }}
                                        className={`btn ${
                                            !canSearch()
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
                                            value={moment(startDatePeriod)}
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

                                {/* cerca auto - periodico */}

                                <div className="w-full flex items-center justify-center mt-4">
                                    <input
                                        aria-disabled={!canSearch()}
                                        aria-label={`${
                                            !canSearch()
                                                ? "Riempi tutti i campi per effettuare una nuova ricerca."
                                                : "Cerca auto."
                                        }`}
                                        type="submit"
                                        value="Cerca auto"
                                        style={{ color: "#fff" }}
                                        className={`btn ${
                                            !canSearch()
                                                ? "btn-error"
                                                : "btn-primary"
                                        } btn-block normal-case`}
                                    />
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <label id="place-search-bar" className="font-medium">
                            Seleziona un punto di ritiro
                        </label>
                        <div className="border mt-2">
                            <Select
                                aria-labelledby="place-search-bar"
                                style={{ width: "100%" }}
                                placeholder="Aereoporto Fiumicino, Roma"
                                onChange={(val) => setPlace(val)}
                            >
                                {options.length > 0 &&
                                    options.map((option, i) => (
                                        <>
                                            <Select.Option
                                                key={"place" + i}
                                                value={option._id}
                                                style={{ height: "40px" }}
                                                aria-label={option.point}
                                            >
                                                <div className="flex justify-between items-center">
                                                    {option.point}{" "}
                                                    {option.type ===
                                                        "airport" && (
                                                        <img
                                                            width={30}
                                                            src="https://img.icons8.com/external-photo3ideastudio-gradient-photo3ideastudio/64/000000/external-airport-public-service-photo3ideastudio-gradient-photo3ideastudio.png"
                                                            alt="Tipologia di punto di ritiro: aereoporto."
                                                        />
                                                    )}
                                                    {option.type ===
                                                        "station" && (
                                                        <img
                                                            width={30}
                                                            src="https://img.icons8.com/nolan/64/train.png"
                                                            alt="Tipologia di punto di ritiro: stazione ferroviaria."
                                                        />
                                                    )}
                                                </div>
                                            </Select.Option>
                                        </>
                                    ))}
                            </Select>
                        </div>

                        <br />

                        <div className="alert alert-info">
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
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <label>
                                    Solo gli utenti registrati possono ricercare
                                    le auto per data
                                </label>
                            </div>
                        </div>
                        <br />
                        {/* cerca auto - solo posto */}
                        <div className="w-full flex items-center justify-center mt-4">
                            <input
                                aria-disabled={!canSearch()}
                                aria-label={`${
                                    !canSearch()
                                        ? "Riempi tutti i campi per effettuare una nuova ricerca."
                                        : "Cerca auto."
                                }`}
                                type="submit"
                                value="Cerca auto"
                                style={{ color: "#fff" }}
                                className={`btn ${
                                    !canSearch() ? "btn-error" : "btn-primary"
                                } btn-block normal-case`}
                            />
                        </div>
                    </>
                )}
            </form>
        </Modal>
    );
};

export default SearchDialog;

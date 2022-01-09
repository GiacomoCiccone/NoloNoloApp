import React, { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";

//react hook form
import { useForm, Controller } from "react-hook-form";
import { updateAction, deleteAction } from "../../actions/userActions";

//antd
import {
    Divider,
    InputNumber,
    Radio,
    message,
    Spin,
    Checkbox,
    Modal,
} from "antd";

//componenti
import Protected from "../Protected";
import Tooltip from "../Tooltip";
import ModifyHandler from "../ModifyHandler";

const AccountScreen = (props) => {
    //useform stuff
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        reset,
    } = useForm();

    //redux stuff
    const { error, authToken, userInfo, isLoading } = useSelector(
        (state) => state.user
    );
    const dispatch = useDispatch();

    //stato
    const [isModifing, setIsModifing] = useState("");
    const [year, month, gender] = watch([
        "update_year",
        "update_month",
        "update_gender",
    ]);
    const [maxDays, setMaxDays] = useState(31);
    const [currentPage, setCurrentPage] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const onSubmit = (data) => {
        if (isLoading) return;

        switch (isModifing) {
            case "username":
                dispatch(
                    updateAction(
                        { username: data.update_username },
                        userInfo._id,
                        authToken
                    )
                ).then(() => {
                    message.success({
                        content: <span role="alert">Modifiche salvate</span>,
                        duration: 5,
                    });
                    reset();
                });
                break;
            case "email":
                dispatch(
                    updateAction(
                        { email: data.update_email },
                        userInfo._id,
                        authToken
                    )
                ).then(() => {
                    message.success({
                        content: <span role="alert">Modifiche salvate</span>,
                        duration: 5,
                    });
                    reset();
                });
                break;
            case "name":
                dispatch(
                    updateAction(
                        {
                            first_name: data.update_name,
                            last_name: data.update_surname,
                        },
                        userInfo._id,
                        authToken
                    )
                ).then(() => {
                    message.success({
                        content: <span role="alert">Modifiche salvate</span>,
                        duration: 5,
                    });
                    reset();
                });
                break;
            case "address":
                dispatch(
                    updateAction(
                        {
                            address: {
                                via: data.update_address,
                                postal_code: data.update_cap,
                                city: data.update_city,
                            },
                        },
                        userInfo._id,
                        authToken
                    )
                ).then(() => {
                    message.success({
                        content: <span role="alert">Modifiche salvate</span>,
                        duration: 5,
                    });
                    reset();
                });
                break;
            case "birth":
                dispatch(
                    updateAction(
                        {
                            birth: new Date(
                                data.update_year,
                                data.update_month - 1,
                                data.update_day
                            ),
                        },
                        userInfo._id,
                        authToken
                    )
                ).then(() => {
                    message.success({
                        content: <span role="alert">Modifiche salvate</span>,
                        duration: 5,
                    });
                    reset();
                });
                break;
            case "gender":
                dispatch(
                    updateAction(
                        {
                            gender: data.update_gender,
                        },
                        userInfo._id,
                        authToken
                    )
                ).then(() => {
                    message.success({
                        content: <span role="alert">Modifiche salvate</span>,
                        duration: 5,
                    });
                    reset();
                });
                break;
            case "password":
                dispatch(
                    updateAction(
                        {
                            passwordOld: data.update_password_old,
                            passwordNew: data.update_password,
                        },
                        userInfo._id,
                        authToken
                    )
                ).then(() => {
                    message.success({
                        content: <span role="alert">Modifiche salvate</span>,
                        duration: 5,
                    });
                    reset();
                });
                break;
            case "preferences":
                dispatch(
                    updateAction(
                        {
                            preferences: data.update_preferences,
                        },
                        userInfo._id,
                        authToken
                    )
                ).then(() => {
                    message.success({
                        content: <span role="alert">Modifiche salvate</span>,
                        duration: 5,
                    });
                    reset();
                });
                break;
            default:
                break;
        }

        setIsModifing("");
    };

    useEffect(() => {
        error &&
            message.error({
                content: <span role="alert">{error}</span>,
                duration: 5,
            });
        error &&
            dispatch({
                type: "RESET_ERROR_USER",
            });
    }, [error, dispatch]);

    const deleteAccount = () => {
        dispatch(deleteAction(userInfo._id, authToken));
    };

    const handleSetIsModifying = (val) => setIsModifing(val);

    useEffect(() => {
        if (year && month) {
            let daysInMonth = new Date(year, month, 0).getDate();
            setMaxDays(daysInMonth);
        }
    }, [year, month]);

    return (
        <Protected history={props.history}>
            {authToken && (
                <div
                    style={{
                        minHeight: "calc(100vh - 5rem)",
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1552083974-186346191183?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
                    }}
                    className="flex justify-center bg-cover relative"
                >
                    <div className="absolute w-full h-full backdrop-blur backdrop-brightness-90"></div>

                    <div className="container mx-auto sm:px-8 lg:px-16 xl:px-20 max-w-4xl z-10 mt-20">
                        <div className="bg-base-200 overflow-hidden shadow-md rounded ">
                            <Spin spinning={isLoading}>
                                {" "}
                                <div className=" px-4 py-8">
                                    <h1>
                                        <span className="text-2xl sm:text-3xl">
                                            Account di {userInfo.first_name}
                                        </span>
                                    </h1>

                                    <Divider style={{ marginTop: "0.7rem" }} />

                                    {currentPage === 1 && (
                                        <div className="px-2">
                                            <div className="flex items-center justify-between">
                                                <h2>
                                                    Informazioni account 1 di 3
                                                </h2>
                                                <div>
                                                    <button
                                                        type="button"
                                                        aria-label="Clicca per andare nelle informazioni anagrafica dell'account."
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => {
                                                            setIsModifing("");
                                                            setCurrentPage(2);
                                                        }}
                                                    >
                                                        <i className="bi bi-arrow-right" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <div>
                                                    <ModifyHandler
                                                        title="Email"
                                                        altTitle="Modifica la tua mail"
                                                        type="email"
                                                        isModifing={isModifing}
                                                        setIsModifing={
                                                            handleSetIsModifying
                                                        }
                                                        ariaLabel={
                                                            isModifing ===
                                                            "email"
                                                                ? "Clicca per uscire dalla modalità modifica."
                                                                : "Clicca per modificare la tua email."
                                                        }
                                                    />

                                                    {isModifing !== "email" ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    marginTop:
                                                                        "0.7rem",
                                                                }}
                                                            >
                                                                {userInfo.email}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit
                                                                )}
                                                            >
                                                                <div className="pt-5">
                                                                    <label
                                                                        htmlFor="update_email"
                                                                        className="font-medium"
                                                                    >
                                                                        Email
                                                                    </label>

                                                                    <div className="mt-2">
                                                                        <input
                                                                            aria-label="Inserisci la tua mail per modificare il tuo account."
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            className={`input ${
                                                                                errors.update_email
                                                                                    ? "input-error"
                                                                                    : "input-primary"
                                                                            } w-full`}
                                                                            id="update_email"
                                                                            {...register(
                                                                                "update_email",
                                                                                {
                                                                                    required:
                                                                                        "Email richiesta",
                                                                                    pattern:
                                                                                        {
                                                                                            //eslint-disable-next-line
                                                                                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                                                            message:
                                                                                                "Inserisci una mail valida",
                                                                                        },
                                                                                }
                                                                            )}
                                                                            placeholder="Inserisci l'e-mail"
                                                                        />
                                                                    </div>

                                                                    {/* Errore */}
                                                                    {errors.update_email && (
                                                                        <div className="mt-2">
                                                                            <span
                                                                                role="alert"
                                                                                className=" text-error"
                                                                            >
                                                                                {
                                                                                    errors
                                                                                        .update_email
                                                                                        .message
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="mt-8">
                                                                    {/* salva */}
                                                                    <input
                                                                        aria-label="Salva le modifiche"
                                                                        type="submit"
                                                                        value="Salva"
                                                                        style={{
                                                                            color: "#fff",
                                                                        }}
                                                                        className={`btn ${
                                                                            errors.update_email
                                                                                ? "btn-error"
                                                                                : "btn-primary"
                                                                        } btn-block normal-case`}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Divider />

                                            {/* Username */}
                                            <div>
                                                <div>
                                                    <ModifyHandler
                                                        title="Username"
                                                        altTitle="Modifica il tuo Username"
                                                        type="username"
                                                        isModifing={isModifing}
                                                        setIsModifing={
                                                            handleSetIsModifying
                                                        }
                                                        ariaLabel={
                                                            isModifing ===
                                                            "username"
                                                                ? "Clicca per uscire dalla modalità modifica."
                                                                : "Clicca per modificare il tuo username."
                                                        }
                                                    />

                                                    {isModifing !==
                                                    "username" ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    marginTop:
                                                                        "0.7rem",
                                                                }}
                                                            >
                                                                {
                                                                    userInfo.username
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit
                                                                )}
                                                            >
                                                                <div className="pt-5">
                                                                    <label
                                                                        htmlFor="update_username"
                                                                        className="font-medium"
                                                                    >
                                                                        Username
                                                                    </label>

                                                                    <div className="mt-2">
                                                                        <input
                                                                            aria-label="Inserisci un username per modificare il tuo account."
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            className={`input ${
                                                                                errors.update_username
                                                                                    ? "input-error"
                                                                                    : "input-primary"
                                                                            } w-full`}
                                                                            id="update_username"
                                                                            {...register(
                                                                                "update_username",
                                                                                {
                                                                                    required:
                                                                                        "Username richiesto",
                                                                                }
                                                                            )}
                                                                            placeholder="Inserisci l'username"
                                                                        />
                                                                    </div>

                                                                    {/* Errore */}
                                                                    {errors.update_username && (
                                                                        <div className="mt-2">
                                                                            <span
                                                                                role="alert"
                                                                                className=" text-error"
                                                                            >
                                                                                {
                                                                                    errors
                                                                                        .update_username
                                                                                        .message
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="mt-8">
                                                                    {/* salva */}
                                                                    <input
                                                                        aria-label="Salva le modifiche"
                                                                        type="submit"
                                                                        value="Salva"
                                                                        style={{
                                                                            color: "#fff",
                                                                        }}
                                                                        className={`btn ${
                                                                            errors.update_username
                                                                                ? "btn-error"
                                                                                : "btn-primary"
                                                                        } btn-block normal-case`}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Divider />

                                            {/* Password */}
                                            <div>
                                                <div>
                                                    <ModifyHandler
                                                        title="Password"
                                                        altTitle="Modifica la tua Password"
                                                        type="password"
                                                        isModifing={isModifing}
                                                        setIsModifing={
                                                            handleSetIsModifying
                                                        }
                                                        ariaLabel={
                                                            isModifing ===
                                                            "password"
                                                                ? "Clicca per uscire dalla modalità modifica."
                                                                : "Clicca per modificare la tua password."
                                                        }
                                                    />

                                                    {isModifing !==
                                                    "password" ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    marginTop:
                                                                        "0.7rem",
                                                                }}
                                                            >
                                                                🤫
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {/* Vecchia Password */}
                                                                    <div className="mt-5 flex-1">
                                                                        <label
                                                                            htmlFor="update_password_old"
                                                                            className="font-medium"
                                                                        >
                                                                            Vecchia
                                                                            password
                                                                        </label>

                                                                        <div className="flex mt-2 relative">
                                                                            <input
                                                                                aria-label="Inserisci la tua vecchia password per modificare il tuo account."
                                                                                autoComplete="off"
                                                                                type={
                                                                                    passwordVisible
                                                                                        ? "text"
                                                                                        : "password"
                                                                                }
                                                                                {...register(
                                                                                    "update_password_old",
                                                                                    {
                                                                                        required:
                                                                                            "Password richiesta",
                                                                                    }
                                                                                )}
                                                                                className={`input ${
                                                                                    errors.update_password_old
                                                                                        ? "input-error"
                                                                                        : "input-primary"
                                                                                } w-full`}
                                                                                id="update_password_old"
                                                                                placeholder="Inserisci una password sicura"
                                                                            />

                                                                            {/* Visibilità password */}
                                                                            <button
                                                                                type="button"
                                                                                aria-label={
                                                                                    "Attiva o disattiva la visualizzazione della password," +
                                                                                    `${
                                                                                        passwordVisible
                                                                                            ? "Stato visibile"
                                                                                            : "Stato nascosta"
                                                                                    }`
                                                                                }
                                                                                onClick={() =>
                                                                                    setPasswordVisible(
                                                                                        (
                                                                                            passwordVisible
                                                                                        ) =>
                                                                                            !passwordVisible
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i
                                                                                    className={`bi ${
                                                                                        passwordVisible
                                                                                            ? "bi-eye"
                                                                                            : "bi-eye-slash"
                                                                                    } absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl`}
                                                                                ></i>
                                                                            </button>
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_password_old && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className="text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_password_old
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Nuova Password */}
                                                                    <div className="mt-5 flex-1">
                                                                        <label
                                                                            htmlFor="update_password"
                                                                            className="font-medium"
                                                                        >
                                                                            Nuova
                                                                            Password
                                                                        </label>

                                                                        {/* Tooltip password*/}
                                                                        <Tooltip
                                                                            color="blue"
                                                                            title="La password deve essere lunga almeno 8 caratteri, deve contenere una lettera maiuscola, una minuscola, un numero ed un carattere speciale"
                                                                            icon="bi-info-circle-fill"
                                                                            type="info"
                                                                        />
                                                                        <div className="flex mt-2 relative">
                                                                            <input
                                                                                aria-label="Inserisci la tua password per modificare il tuo account."
                                                                                autoComplete="off"
                                                                                type={
                                                                                    passwordVisible
                                                                                        ? "text"
                                                                                        : "password"
                                                                                }
                                                                                {...register(
                                                                                    "update_password",
                                                                                    {
                                                                                        required:
                                                                                            "Password richiesta",
                                                                                        pattern:
                                                                                            {
                                                                                                // eslint-disable-next-line
                                                                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                                                                                                message:
                                                                                                    "Inserisci una password valida",
                                                                                            },
                                                                                    }
                                                                                )}
                                                                                className={`input ${
                                                                                    errors.update_password
                                                                                        ? "input-error"
                                                                                        : "input-primary"
                                                                                } w-full`}
                                                                                id="update_password"
                                                                                placeholder="Inserisci una password sicura"
                                                                            />

                                                                            {/* Visibilità password */}
                                                                            <button
                                                                                type="button"
                                                                                aria-label={
                                                                                    "Attiva o disattiva la visualizzazione della password," +
                                                                                    `${
                                                                                        passwordVisible
                                                                                            ? "Stato visibile"
                                                                                            : "Stato nascosta"
                                                                                    }`
                                                                                }
                                                                                onClick={() =>
                                                                                    setPasswordVisible(
                                                                                        (
                                                                                            passwordVisible
                                                                                        ) =>
                                                                                            !passwordVisible
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i
                                                                                    className={`bi ${
                                                                                        passwordVisible
                                                                                            ? "bi-eye"
                                                                                            : "bi-eye-slash"
                                                                                    } absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl`}
                                                                                ></i>
                                                                            </button>
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_password && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className="text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_password
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-8">
                                                                    {/* salva */}
                                                                    <input
                                                                        aria-label="Salva le modifiche"
                                                                        type="submit"
                                                                        value="Salva"
                                                                        style={{
                                                                            color: "#fff",
                                                                        }}
                                                                        className={`btn ${
                                                                            errors.update_password_old ||
                                                                            errors.update_password
                                                                                ? "btn-error"
                                                                                : "btn-primary"
                                                                        } btn-block normal-case`}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentPage === 2 && (
                                        <div className="px-2">
                                            <div className="flex items-center justify-between">
                                                <h2>
                                                    Informazioni anagrafiche 2
                                                    di 3
                                                </h2>
                                                <div>
                                                    <button
                                                        type="button"
                                                        aria-label="Clicca per andare nelle informazioni sull'account."
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => {
                                                            setIsModifing("");
                                                            setCurrentPage(1);
                                                        }}
                                                    >
                                                        <i className="bi bi-arrow-left" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-label="Clicca per andare nella pagina delle preferenze."
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => {
                                                            setIsModifing("");
                                                            setCurrentPage(3);
                                                        }}
                                                    >
                                                        <i className="bi bi-arrow-right" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Nome e cognome */}
                                            <div>
                                                <div>
                                                    <ModifyHandler
                                                        title="Nome"
                                                        altTitle="Modifica il tuo nome"
                                                        type="name"
                                                        isModifing={isModifing}
                                                        setIsModifing={
                                                            handleSetIsModifying
                                                        }
                                                        ariaLabel={
                                                            isModifing ===
                                                            "name"
                                                                ? "Clicca per uscire dalla modalità modifica."
                                                                : "Clicca per modificare il tuo nome."
                                                        }
                                                    />

                                                    {isModifing !== "name" ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    marginTop:
                                                                        "0.7rem",
                                                                }}
                                                            >
                                                                {userInfo.first_name +
                                                                    " " +
                                                                    userInfo.last_name}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit
                                                                )}
                                                            >
                                                                <div className="flex items-center flex-col sm:flex-row gap-2">
                                                                    {/* Nome */}
                                                                    <div className="pt-5 flex-1 w-full">
                                                                        <label
                                                                            htmlFor="update_name"
                                                                            className="font-medium"
                                                                        >
                                                                            Nome
                                                                        </label>

                                                                        <div className="mt-2">
                                                                            <input
                                                                                aria-label="Inserisci Il tuo nome per modificare il tuo account."
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                className={`input ${
                                                                                    errors.update_name
                                                                                        ? "input-error"
                                                                                        : "input-primary"
                                                                                } w-full`}
                                                                                id="update_name"
                                                                                {...register(
                                                                                    "update_name",
                                                                                    {
                                                                                        required:
                                                                                            "Nome richiesto",
                                                                                    }
                                                                                )}
                                                                                placeholder="Inserisci il nome"
                                                                            />
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_name && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className=" text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_name
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Cognome */}
                                                                    <div className="pt-5 flex-1 w-full">
                                                                        <label
                                                                            htmlFor="update_surname"
                                                                            className="font-medium"
                                                                        >
                                                                            Cognome
                                                                        </label>

                                                                        <div className="mt-2">
                                                                            <input
                                                                                aria-label="Inserisci Il tuo cognome per modificare il tuo account."
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                className={`input ${
                                                                                    errors.update_surname
                                                                                        ? "input-error"
                                                                                        : "input-primary"
                                                                                } w-full`}
                                                                                id="update_surname"
                                                                                {...register(
                                                                                    "update_surname",
                                                                                    {
                                                                                        required:
                                                                                            "Cognome richiesto",
                                                                                    }
                                                                                )}
                                                                                placeholder="Inserisci il cognome"
                                                                            />
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_surname && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className=" text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_surname
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-8">
                                                                    {/* salva */}
                                                                    <input
                                                                        aria-label="Salva le modifiche"
                                                                        type="submit"
                                                                        value="Salva"
                                                                        style={{
                                                                            color: "#fff",
                                                                        }}
                                                                        className={`btn ${
                                                                            errors.update_name ||
                                                                            errors.update_surname
                                                                                ? "btn-error"
                                                                                : "btn-primary"
                                                                        } btn-block normal-case`}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Divider />

                                            {/* Indirizzo - Città - CAP */}
                                            <div>
                                                <div>
                                                    <ModifyHandler
                                                        title="Indirizzo"
                                                        altTitle="Modifica il tuo indirizzo"
                                                        type="address"
                                                        isModifing={isModifing}
                                                        setIsModifing={
                                                            handleSetIsModifying
                                                        }
                                                        ariaLabel={
                                                            isModifing ===
                                                            "address"
                                                                ? "Clicca per uscire dalla modalità modifica."
                                                                : "Clicca per modificare il tuo indirizzo."
                                                        }
                                                    />

                                                    {isModifing !==
                                                    "address" ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    marginTop:
                                                                        "0.7rem",
                                                                }}
                                                            >
                                                                {userInfo
                                                                    .address
                                                                    .via +
                                                                    " " +
                                                                    userInfo
                                                                        .address
                                                                        .city +
                                                                    " " +
                                                                    userInfo
                                                                        .address
                                                                        .postal_code}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit
                                                                )}
                                                            >
                                                                {/* Indirizzo */}
                                                                <div className="pt-5">
                                                                    <label
                                                                        htmlFor="update_address"
                                                                        className="font-medium"
                                                                    >
                                                                        Indirizzo
                                                                    </label>
                                                                    {/* Tooltip indirizzo*/}
                                                                    <Tooltip
                                                                        color="blue"
                                                                        title="L'indirizzo deve essere nel formato: Via, Nome via, Numero civico. L'indirizzo immesso sarà utilizzato per la fatturazione dei tuoi noleggi."
                                                                        icon="bi-info-circle-fill"
                                                                        type="info"
                                                                    />

                                                                    <div className="mt-2">
                                                                        <input
                                                                            aria-label="Inserisci Il tuo indirizzo per modificare il tuo account."
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            className={`input ${
                                                                                errors.update_address
                                                                                    ? "input-error"
                                                                                    : "input-primary"
                                                                            } w-full`}
                                                                            id="update_address"
                                                                            {...register(
                                                                                "update_address",
                                                                                {
                                                                                    required:
                                                                                        "Indirizzo richiesto",
                                                                                    pattern:
                                                                                        {
                                                                                            // eslint-disable-next-line
                                                                                            value: /^[a-zA-Z]+[a-zA-Z\s]*\d{1,3}/,
                                                                                            message:
                                                                                                "Inserisci un indirizzo valido",
                                                                                        },
                                                                                }
                                                                            )}
                                                                            placeholder="Via Monte Napoleone 1"
                                                                        />
                                                                    </div>

                                                                    {/* Errore */}
                                                                    {errors.update_address && (
                                                                        <div className="mt-2">
                                                                            <span
                                                                                role="alert"
                                                                                className=" text-error"
                                                                            >
                                                                                {
                                                                                    errors
                                                                                        .update_address
                                                                                        .message
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Città codice postale */}
                                                                <div className="flex items-center gap-2">
                                                                    {/* Città */}
                                                                    <div className="pt-5 flex-1">
                                                                        <label
                                                                            htmlFor="update_city"
                                                                            className="font-medium"
                                                                        >
                                                                            Città
                                                                        </label>

                                                                        <div className="mt-2">
                                                                            <input
                                                                                aria-label="Inserisci la tua città per modificare il tuo account."
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                className={`input ${
                                                                                    errors.update_city
                                                                                        ? "input-error"
                                                                                        : "input-primary"
                                                                                } w-full`}
                                                                                id="update_city"
                                                                                {...register(
                                                                                    "update_city",
                                                                                    {
                                                                                        required:
                                                                                            "Città richiesta",
                                                                                        pattern:
                                                                                            {
                                                                                                // eslint-disable-next-line
                                                                                                value: /^[A-Z]+$/i,
                                                                                                message:
                                                                                                    "Inserisci una città valida",
                                                                                            },
                                                                                    }
                                                                                )}
                                                                                placeholder="Milano"
                                                                            />
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_city && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className=" text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_city
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Codice postale */}
                                                                    <div className="pt-5 flex-1">
                                                                        <label
                                                                            htmlFor="update_cap"
                                                                            className="font-medium"
                                                                        >
                                                                            CAP
                                                                        </label>

                                                                        <div className="mt-2">
                                                                            <input
                                                                                aria-label="Inserisci il codice postale per modificare il tuo account."
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                className={`input ${
                                                                                    errors.update_cap
                                                                                        ? "input-error"
                                                                                        : "input-primary"
                                                                                } w-full`}
                                                                                id="update_cap"
                                                                                {...register(
                                                                                    "update_cap",
                                                                                    {
                                                                                        required:
                                                                                            "CAP richiesto",
                                                                                        pattern:
                                                                                            {
                                                                                                // eslint-disable-next-line
                                                                                                value: /\b\d{5}\b/g,
                                                                                                message:
                                                                                                    "Inserisci un CAP valido",
                                                                                            },
                                                                                    }
                                                                                )}
                                                                                placeholder="Ad esempio 20121"
                                                                            />
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_cap && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className=" text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_cap
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-8">
                                                                    {/* salva */}
                                                                    <input
                                                                        aria-label="Salva le modifiche"
                                                                        type="submit"
                                                                        value="Salva"
                                                                        style={{
                                                                            color: "#fff",
                                                                        }}
                                                                        className={`btn ${
                                                                            errors.update_cap ||
                                                                            errors.update_address ||
                                                                            errors.update_city
                                                                                ? "btn-error"
                                                                                : "btn-primary"
                                                                        } btn-block normal-case`}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Divider />

                                            {/* Data di nascita */}
                                            <div>
                                                <div>
                                                    <ModifyHandler
                                                        title="Data di nascita"
                                                        altTitle="Modifica la tua data di nascita"
                                                        type="birth"
                                                        isModifing={isModifing}
                                                        setIsModifing={
                                                            handleSetIsModifying
                                                        }
                                                        ariaLabel={
                                                            isModifing ===
                                                            "birth"
                                                                ? "Clicca per uscire dalla modalità modifica."
                                                                : "Clicca per modificare la tua data di nascita."
                                                        }
                                                    />

                                                    {isModifing !== "birth" ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    marginTop:
                                                                        "0.7rem",
                                                                }}
                                                            >
                                                                {new Date(
                                                                    userInfo.birth
                                                                ).toLocaleDateString(
                                                                    "it"
                                                                )}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit
                                                                )}
                                                            >
                                                                {/* Data di nascita */}
                                                                <div className="flex items-center justify-evenly gap-2">
                                                                    {/* Giorno */}
                                                                    <div className="pt-5">
                                                                        <label
                                                                            aria-label="Inserisci il tuo giorno di nascita per modificare il tuo account."
                                                                            htmlFor="update_day"
                                                                            className="font-medium"
                                                                        >
                                                                            Giorno
                                                                        </label>

                                                                        <div className="mt-2">
                                                                            <Controller
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="update_day"
                                                                                rules={{
                                                                                    required:
                                                                                        "Giorno di nascita richiesto",
                                                                                    max: maxDays,
                                                                                }}
                                                                                render={({
                                                                                    field: {
                                                                                        onChange,
                                                                                        onBlur,
                                                                                        value,
                                                                                        ref,
                                                                                    },
                                                                                }) => (
                                                                                    <InputNumber
                                                                                        style={{
                                                                                            border:
                                                                                                errors.update_day &&
                                                                                                "1px solid #ff5724",
                                                                                            boxShadow:
                                                                                                errors.update_day &&
                                                                                                "none",
                                                                                        }}
                                                                                        id="update_day"
                                                                                        name="update_day"
                                                                                        min={
                                                                                            1
                                                                                        }
                                                                                        max={
                                                                                            maxDays
                                                                                        }
                                                                                        onBlur={
                                                                                            onBlur
                                                                                        }
                                                                                        onChange={
                                                                                            onChange
                                                                                        }
                                                                                        value={
                                                                                            value
                                                                                        }
                                                                                        ref={
                                                                                            ref
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_day && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className=" text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_day
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Mese */}
                                                                    <div className="pt-5">
                                                                        <label
                                                                            aria-label="Inserisci il tuo mese di nascita per modificare il tuo account."
                                                                            htmlFor="update_month"
                                                                            className="font-medium"
                                                                        >
                                                                            Mese
                                                                        </label>

                                                                        <div className="mt-2">
                                                                            <Controller
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="update_month"
                                                                                rules={{
                                                                                    required:
                                                                                        "Mese di nascita richiesto",
                                                                                }}
                                                                                render={({
                                                                                    field: {
                                                                                        onChange,
                                                                                        onBlur,
                                                                                        value,
                                                                                        ref,
                                                                                    },
                                                                                }) => (
                                                                                    <InputNumber
                                                                                        style={{
                                                                                            border:
                                                                                                errors.update_month &&
                                                                                                "1px solid #ff5724",
                                                                                            boxShadow:
                                                                                                errors.update_month &&
                                                                                                "none",
                                                                                        }}
                                                                                        id="update_month"
                                                                                        name="update_month"
                                                                                        min={
                                                                                            1
                                                                                        }
                                                                                        max={
                                                                                            12
                                                                                        }
                                                                                        onBlur={
                                                                                            onBlur
                                                                                        }
                                                                                        onChange={
                                                                                            onChange
                                                                                        }
                                                                                        value={
                                                                                            value
                                                                                        }
                                                                                        ref={
                                                                                            ref
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_month && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className=" text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_month
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Anno */}
                                                                    <div className="pt-5">
                                                                        <label
                                                                            aria-label="Inserisci il tuo anno di nascita per modificare il tuo account."
                                                                            htmlFor="update_year"
                                                                            className="font-medium"
                                                                        >
                                                                            Anno
                                                                        </label>

                                                                        <div className="mt-2">
                                                                            <Controller
                                                                                control={
                                                                                    control
                                                                                }
                                                                                name="update_year"
                                                                                rules={{
                                                                                    required:
                                                                                        "Anno di nascita richiesto",
                                                                                }}
                                                                                render={({
                                                                                    field: {
                                                                                        onChange,
                                                                                        onBlur,
                                                                                        value,
                                                                                        ref,
                                                                                    },
                                                                                }) => (
                                                                                    <InputNumber
                                                                                        style={{
                                                                                            border:
                                                                                                errors.update_year &&
                                                                                                "1px solid #ff5724",
                                                                                            boxShadow:
                                                                                                errors.update_year &&
                                                                                                "none",
                                                                                        }}
                                                                                        id="update_year"
                                                                                        name="update_year"
                                                                                        min={
                                                                                            1930
                                                                                        }
                                                                                        max={
                                                                                            new Date().getFullYear() -
                                                                                            1
                                                                                        }
                                                                                        onBlur={
                                                                                            onBlur
                                                                                        }
                                                                                        onChange={
                                                                                            onChange
                                                                                        }
                                                                                        value={
                                                                                            value
                                                                                        }
                                                                                        ref={
                                                                                            ref
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>

                                                                        {/* Errore */}
                                                                        {errors.update_year && (
                                                                            <div className="mt-2">
                                                                                <span
                                                                                    role="alert"
                                                                                    className=" text-error"
                                                                                >
                                                                                    {
                                                                                        errors
                                                                                            .update_year
                                                                                            .message
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>{" "}
                                                                <div className="mt-8">
                                                                    {/* salva */}
                                                                    <input
                                                                        aria-label="Salva le modifiche"
                                                                        type="submit"
                                                                        value="Salva"
                                                                        style={{
                                                                            color: "#fff",
                                                                        }}
                                                                        className={`btn ${
                                                                            errors.update_month ||
                                                                            errors.update_year ||
                                                                            errors.update_day
                                                                                ? "btn-error"
                                                                                : "btn-primary"
                                                                        } btn-block normal-case`}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Divider />

                                            {/* Sesso */}
                                            <div>
                                                <div>
                                                    <ModifyHandler
                                                        title="Genere"
                                                        altTitle="Modifica il tuo genere"
                                                        type="gender"
                                                        isModifing={isModifing}
                                                        setIsModifing={
                                                            handleSetIsModifying
                                                        }
                                                        ariaLabel={
                                                            isModifing ===
                                                            "gender"
                                                                ? "Clicca per uscire dalla modalità modifica."
                                                                : "Clicca per modificare il tuo genere."
                                                        }
                                                    />

                                                    {isModifing !== "gender" ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    marginTop:
                                                                        "0.7rem",
                                                                }}
                                                            >
                                                                {userInfo.gender ===
                                                                "male"
                                                                    ? "Maschio"
                                                                    : "Femmina"}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit
                                                                )}
                                                            >
                                                                <div className="pt-5">
                                                                    <label
                                                                        aria-label={`${
                                                                            !gender
                                                                                ? "Per favore seleziona il tuo genere per modificare il tuo account."
                                                                                : `Genere selezionato: ${
                                                                                      gender ===
                                                                                      "male"
                                                                                          ? "Maschio"
                                                                                          : "Femmina"
                                                                                  }`
                                                                        }. Utilizza le frecce per cambiare.`}
                                                                        id="update_gender_label"
                                                                        className="font-medium"
                                                                    >
                                                                        Genere
                                                                    </label>

                                                                    <div className="mt-2">
                                                                        <Controller
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="update_gender"
                                                                            rules={{
                                                                                required:
                                                                                    "Genere richiesto",
                                                                            }}
                                                                            render={({
                                                                                field: {
                                                                                    onChange,
                                                                                    onBlur,
                                                                                    value,
                                                                                    ref,
                                                                                },
                                                                            }) => (
                                                                                <Radio.Group
                                                                                    name="update_gender"
                                                                                    onChange={
                                                                                        onChange
                                                                                    }
                                                                                    ref={
                                                                                        ref
                                                                                    }
                                                                                    value={
                                                                                        value
                                                                                    }
                                                                                    onBlur={
                                                                                        onBlur
                                                                                    }
                                                                                >
                                                                                    <Radio
                                                                                        style={{
                                                                                            padding:
                                                                                                "0.5rem",
                                                                                            border: errors.update_gender
                                                                                                ? "1px solid #ff5724"
                                                                                                : "1px solid #0ed3cf",
                                                                                            boxShadow:
                                                                                                errors.update_gender &&
                                                                                                "none",
                                                                                        }}
                                                                                        value={
                                                                                            "male"
                                                                                        }
                                                                                        aria-labelledby="update_gender_label"
                                                                                    >
                                                                                        Maschio
                                                                                    </Radio>
                                                                                    <Radio
                                                                                        style={{
                                                                                            padding:
                                                                                                "0.5rem",
                                                                                            border: errors.update_gender
                                                                                                ? "1px solid #ff5724"
                                                                                                : "1px solid #0ed3cf",
                                                                                            boxShadow:
                                                                                                errors.update_gender &&
                                                                                                "none",
                                                                                        }}
                                                                                        value={
                                                                                            "female"
                                                                                        }
                                                                                        aria-labelledby="update_gender_label"
                                                                                    >
                                                                                        Femmina
                                                                                    </Radio>
                                                                                </Radio.Group>
                                                                            )}
                                                                        />
                                                                    </div>

                                                                    {/* Errore */}
                                                                    {errors.update_gender && (
                                                                        <div className="mt-2">
                                                                            <span
                                                                                role="alert"
                                                                                className=" text-error"
                                                                            >
                                                                                {
                                                                                    errors
                                                                                        .update_gender
                                                                                        .message
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="mt-8">
                                                                    {/* salva */}
                                                                    <input
                                                                        aria-label="Salva le modifiche"
                                                                        type="submit"
                                                                        value="Salva"
                                                                        style={{
                                                                            color: "#fff",
                                                                        }}
                                                                        className={`btn ${
                                                                            errors.update_gender
                                                                                ? "btn-error"
                                                                                : "btn-primary"
                                                                        } btn-block normal-case`}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentPage === 3 && (
                                        <div className="px-2">
                                            <div className="flex items-center justify-between">
                                                <h2>
                                                    Preferenze account 3 di 3
                                                </h2>

                                                <div>
                                                    <button
                                                        type="button"
                                                        aria-label="Clicca per andare nelle informazioni anagrafica dell'account."
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => {
                                                            setIsModifing("");
                                                            setCurrentPage(2);
                                                        }}
                                                    >
                                                        <i className="bi bi-arrow-return-left" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Preferenze */}
                                            <div>
                                                <div>
                                                    <ModifyHandler
                                                        title="Preferenze di noleggio"
                                                        altTitle="Modifica le tue preferenze di noleggio"
                                                        type="preferences"
                                                        isModifing={isModifing}
                                                        setIsModifing={
                                                            handleSetIsModifying
                                                        }
                                                        ariaLabel={
                                                            isModifing ===
                                                            "preferences"
                                                                ? "Clicca per uscire dalla modalità modifica."
                                                                : "Clicca per modificare le tue preferenze di noleggio."
                                                        }
                                                        tooltip={
                                                            <Tooltip
                                                                color="blue"
                                                                title="Le preferenze che indicherai verranno utilizzate per mostrarti risultati più coerenti in evidenza."
                                                                icon="bi-info-circle-fill"
                                                                type="info"
                                                            />
                                                        }
                                                    />

                                                    {isModifing !==
                                                    "preferences" ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    marginTop:
                                                                        "0.7rem",
                                                                }}
                                                            >
                                                                {userInfo
                                                                    .preferences
                                                                    .length ===
                                                                0 ? (
                                                                    <>
                                                                        Aggiungi
                                                                        preferenze
                                                                        di
                                                                        noleggio
                                                                    </>
                                                                ) : (
                                                                    userInfo.preferences.map(
                                                                        (
                                                                            preference,
                                                                            i
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    preference +
                                                                                    i +
                                                                                    userInfo._id
                                                                                }
                                                                            >{`${preference}${
                                                                                i <
                                                                                userInfo
                                                                                    .preferences
                                                                                    .length -
                                                                                    1
                                                                                    ? ", "
                                                                                    : ""
                                                                            }`}</span>
                                                                        )
                                                                    )
                                                                )}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <form
                                                                onSubmit={handleSubmit(
                                                                    onSubmit
                                                                )}
                                                            >
                                                                <div className="pt-5">
                                                                    <label className="font-medium">
                                                                        Preferenze
                                                                        di
                                                                        noleggio
                                                                    </label>

                                                                    <div className="mt-2">
                                                                        <Controller
                                                                            control={
                                                                                control
                                                                            }
                                                                            name="update_preferences"
                                                                            render={({
                                                                                field: {
                                                                                    onChange,
                                                                                    onBlur,
                                                                                    value,
                                                                                    ref,
                                                                                },
                                                                            }) => (
                                                                                <Checkbox.Group
                                                                                    name="update_preferences"
                                                                                    onChange={
                                                                                        onChange
                                                                                    }
                                                                                    ref={
                                                                                        ref
                                                                                    }
                                                                                    value={
                                                                                        value
                                                                                    }
                                                                                    onBlur={
                                                                                        onBlur
                                                                                    }
                                                                                    style={{
                                                                                        display:
                                                                                            "flex",
                                                                                        gap: "1rem",
                                                                                        flexWrap:
                                                                                            "wrap",
                                                                                    }}
                                                                                >
                                                                                    <Checkbox
                                                                                        style={{
                                                                                            padding:
                                                                                                "0.5rem",
                                                                                            border: "1px solid #0ed3cf",
                                                                                        }}
                                                                                        value={
                                                                                            "sportiva"
                                                                                        }
                                                                                        aria-label="Scegli le tue preferenze di noleggio. Sportiva. Premi spazio per selezionare o deselezionare."
                                                                                    >
                                                                                        Sportiva
                                                                                    </Checkbox>

                                                                                    <Checkbox
                                                                                        style={{
                                                                                            padding:
                                                                                                "0.5rem",
                                                                                            border: "1px solid #0ed3cf",
                                                                                        }}
                                                                                        value={
                                                                                            "elegante"
                                                                                        }
                                                                                        aria-label="Elegante."
                                                                                    >
                                                                                        Elegante
                                                                                    </Checkbox>

                                                                                    <Checkbox
                                                                                        style={{
                                                                                            padding:
                                                                                                "0.5rem",
                                                                                            border: "1px solid #0ed3cf",
                                                                                        }}
                                                                                        value={
                                                                                            "famiglia"
                                                                                        }
                                                                                        aria-label="Famiglia."
                                                                                    >
                                                                                        Famiglia
                                                                                    </Checkbox>

                                                                                    <Checkbox
                                                                                        style={{
                                                                                            padding:
                                                                                                "0.5rem",
                                                                                            border: "1px solid #0ed3cf",
                                                                                        }}
                                                                                        value={
                                                                                            "viaggio"
                                                                                        }
                                                                                        aria-label="Viaggio."
                                                                                    >
                                                                                        Viaggio
                                                                                    </Checkbox>
                                                                                </Checkbox.Group>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="mt-8">
                                                                    {/* salva */}
                                                                    <input
                                                                        aria-label="Salva le modifiche"
                                                                        type="submit"
                                                                        value="Salva"
                                                                        style={{
                                                                            color: "#fff",
                                                                        }}
                                                                        className="btn btn-primary btn-block normal-case"
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Spin>
                        </div>

                        <div className="mt-16 flex justify-center items-center">
                            <button
                                onClick={() => setModalOpen(true)}
                                className="btn btn-error btn-wide"
                                aria-label="Clicca per eliminare il tuo account."
                                type="button"
                            >
                                <span className="text-white">
                                    Elimina account
                                </span>
                            </button>
                        </div>

                        <Modal
                            title="Conferma eliminazione account"
                            visible={modalOpen}
                            onOk={deleteAccount}
                            onCancel={() => setModalOpen(false)}
                            okType="danger"
                            okText="Conferma"
                        >
                            <p>
                                Attenzione, quest'operazione è irreversibile. Se
                                elimini il tuo account non potrai più accedervi.
                            </p>

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
                                    <label aria-label="Nel caso in cui avessi già effettuato qualche noleggio con questo account, manterremo le informazioni sui tuoi noleggi.">
                                        Nel caso in cui avessi già effettuato
                                        qualche noleggio con questo account,
                                        manterremo le informazioni sui tuoi
                                        noleggi.
                                    </label>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            )}
        </Protected>
    );
};

export default AccountScreen;

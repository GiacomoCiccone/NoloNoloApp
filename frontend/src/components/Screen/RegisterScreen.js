import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//react hook form
import { useForm, Controller } from "react-hook-form";

//antd
import { Spin, message, InputNumber, Radio } from "antd";

//redux
import { useDispatch, useSelector } from "react-redux";
import { registerAction } from "../../actions/userActions";

//components
import Tooltip from "../Tooltip";


const RegisterScreen = (props) => {
    //useform stuff
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm();

    //redux stuff
    const user = useSelector((state) => state.user);
    const { error, isLoading, authToken } = user;
    const dispatch = useDispatch();

    //stato
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [year, month, gender] = watch(["register_year", "register_month", "register_gender"]);
    const [maxDays, setMaxDays] = useState(31);
    const [currentPage, setCurrentPage] = useState(1);

    //form
    const onSubmit = (data) => {
        if (isLoading) return
        const body = {
            email: data.register_email,
            username: data.register_username,
            password: data.register_password,
            first_name: data.register_name,
            last_name: data.register_surname,
            address: {
                city: data.register_city,
                via: data.register_address,
                postal_code: data.register_cap
            },
            birth: new Date(data.register_year, data.register_month - 1, data.register_day),
            gender: data.register_gender
        }

        dispatch(registerAction(body));
    };

    const checkErrors = () => {
        let error = false;
        const props = Object.keys(errors);
        props?.forEach((element) => {
            if (element) {
                error = true;
            }
        });
        return error;
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

    useEffect(() => {
        authToken && props.history.push("/");
    }, [props.history, authToken]);

    useEffect(() => {
        if (year && month) {
            let daysInMonth = new Date(year, month, 0).getDate();
            setMaxDays(daysInMonth);
        }
    }, [year, month]);

    return (
        <div
            style={{ minHeight: "1000px", height: "calc(100vh - 5rem)" }}
            className="flex"
        >
            {/* Immagine */}
            <div className="w-1/2 hidden md:block h-full order-2">
                <img
                    className=" w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1552083940-86877723de7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
                    alt=""
                />
            </div>

            <div
                style={{ padding: "0% 4%" }}
                className="w-full md:w-1/2 flex flex-col order-1"
            >
                <span className="mt-16"></span>
                <h2 className="text-4xl text-center">
                    <span>Iscriviti, è veloce</span>
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=" w-full max-w-md bg-base-300 rounded-md shadow-md relative left-1/2 -translate-x-1/2 overflow-hidden"
                >
                    <Spin spinning={isLoading}>
                        <div className="p-5">
                            <div
                                className={`${
                                    currentPage === 1 ? "block" : "hidden"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 style={{ margin: "0" }}>
                                        1 di 2 Informazioni Account
                                    </h3>

                                    <button
                                        type="button"
                                        aria-label="Clicca per andare nel form relativo alle informazioni anagrafiche."
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => setCurrentPage(2)}
                                    >
                                        <i className="bi bi-arrow-right" />
                                    </button>
                                </div>
                                {/* Email */}
                                <div className="pt-5">
                                    <label
                                        htmlFor="register_email"
                                        className="font-medium"
                                    >
                                        Email
                                    </label>

                                    <div className="mt-2">
                                        <input
                                            aria-label="Inserisci la tua mail per creare il tuo account."
                                            type="text"
                                            autoComplete="off"
                                            className={`input ${
                                                errors.register_email
                                                    ? "input-error"
                                                    : "input-primary"
                                            } w-full`}
                                            id="register_email"
                                            {...register("register_email", {
                                                required: "Email richiesta",
                                                pattern: {
                                                    //eslint-disable-next-line
                                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                    message:
                                                        "Inserisci una mail valida",
                                                },
                                            })}
                                            placeholder="Inserisci l'e-mail"
                                        />
                                    </div>

                                    {/* Errore */}
                                    {errors.register_email && (
                                        <div className="mt-2">
                                            <span
                                                role="alert"
                                                className=" text-error"
                                            >
                                                {errors.register_email.message}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {/* Username */}
                                <div className="pt-5">
                                    <label
                                        htmlFor="register_username"
                                        className="font-medium"
                                    >
                                        Username
                                    </label>

                                    <div className="mt-2">
                                        <input
                                            aria-label="Inserisci un username per creare il tuo account."
                                            type="text"
                                            autoComplete="off"
                                            className={`input ${
                                                errors.register_username
                                                    ? "input-error"
                                                    : "input-primary"
                                            } w-full`}
                                            id="register_username"
                                            {...register("register_username", {
                                                required: "Username richiesto",
                                            })}
                                            placeholder="Inserisci l'username"
                                        />
                                    </div>

                                    {/* Errore */}
                                    {errors.register_username && (
                                        <div className="mt-2">
                                            <span
                                                role="alert"
                                                className=" text-error"
                                            >
                                                {
                                                    errors.register_username
                                                        .message
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {/* Password */}
                                <div className="mt-5">
                                    <label
                                        htmlFor="register_password"
                                        className="font-medium"
                                    >
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
                                            aria-label="Inserisci la tua password per creare il tuo account."
                                            autoComplete="off"
                                            type={
                                                passwordVisible
                                                    ? "text"
                                                    : "password"
                                            }
                                            {...register("register_password", {
                                                required: "Password richiesta",
                                                pattern: {
                                                    // eslint-disable-next-line
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                                                    message:
                                                        "Inserisci una password valida",
                                                },
                                            })}
                                            className={`input ${
                                                errors.register_password
                                                    ? "input-error"
                                                    : "input-primary"
                                            } w-full`}
                                            id="register_password"
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
                                                    (passwordVisible) =>
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
                                    {errors.register_password && (
                                        <div className="mt-2">
                                            <span
                                                role="alert"
                                                className="text-error"
                                            >
                                                {
                                                    errors.register_password
                                                        .message
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>{" "}
                            <div
                                className={`${
                                    currentPage === 2 ? "block" : "hidden"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 style={{ margin: "0" }}>
                                        2 di 2 Informazioni Anagrafiche
                                    </h3>

                                    <button
                                        type="button"
                                        aria-label="Clicca per andare nel form relativo alle informazioni sul tuo account."
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => setCurrentPage(1)}
                                    >
                                        <i className="bi bi-arrow-return-left" />
                                    </button>
                                </div>
                                {/* Nome e cognome */}
                                <div className="flex items-center gap-2">
                                    {/* Nome */}
                                    <div className="pt-5">
                                        <label
                                            htmlFor="register_name"
                                            className="font-medium"
                                        >
                                            Nome
                                        </label>

                                        <div className="mt-2">
                                            <input
                                                aria-label="Inserisci Il tuo nome per creare il tuo account."
                                                type="text"
                                                autoComplete="off"
                                                className={`input ${
                                                    errors.register_name
                                                        ? "input-error"
                                                        : "input-primary"
                                                } w-full`}
                                                id="register_name"
                                                {...register("register_name", {
                                                    required: "Nome richiesto",
                                                })}
                                                placeholder="Inserisci il nome"
                                            />
                                        </div>

                                        {/* Errore */}
                                        {errors.register_name && (
                                            <div className="mt-2">
                                                <span
                                                    role="alert"
                                                    className=" text-error"
                                                >
                                                    {
                                                        errors.register_name
                                                            .message
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cognome */}
                                    <div className="pt-5">
                                        <label
                                            htmlFor="register_surname"
                                            className="font-medium"
                                        >
                                            Cognome
                                        </label>

                                        <div className="mt-2">
                                            <input
                                                aria-label="Inserisci Il tuo cognome per creare il tuo account."
                                                type="text"
                                                autoComplete="off"
                                                className={`input ${
                                                    errors.register_surname
                                                        ? "input-error"
                                                        : "input-primary"
                                                } w-full`}
                                                id="register_surname"
                                                {...register(
                                                    "register_surname",
                                                    {
                                                        required:
                                                            "Cognome richiesto",
                                                    }
                                                )}
                                                placeholder="Inserisci il cognome"
                                            />
                                        </div>

                                        {/* Errore */}
                                        {errors.register_surname && (
                                            <div className="mt-2">
                                                <span
                                                    role="alert"
                                                    className=" text-error"
                                                >
                                                    {
                                                        errors.register_surname
                                                            .message
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Indirizzo */}
                                <div className="pt-5">
                                    <label
                                        htmlFor="register_address"
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
                                            aria-label="Inserisci Il tuo indirizzo per creare il tuo account."
                                            type="text"
                                            autoComplete="off"
                                            className={`input ${
                                                errors.register_address
                                                    ? "input-error"
                                                    : "input-primary"
                                            } w-full`}
                                            id="register_address"
                                            {...register("register_address", {
                                                required: "Indirizzo richiesto",
                                                pattern: {
                                                    // eslint-disable-next-line
                                                    value: /^[a-zA-Z]+[a-zA-Z\s]*\d{1,3}/,
                                                    message:
                                                        "Inserisci un indirizzo valido",
                                                },
                                            })}
                                            placeholder="Via Monte Napoleone 1"
                                        />
                                    </div>

                                    {/* Errore */}
                                    {errors.register_address && (
                                        <div className="mt-2">
                                            <span
                                                role="alert"
                                                className=" text-error"
                                            >
                                                {
                                                    errors.register_address
                                                        .message
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {/* Città codice postale */}
                                <div className="flex items-center gap-2">
                                    {/* Città */}
                                    <div className="pt-5">
                                        <label
                                            htmlFor="register_city"
                                            className="font-medium"
                                        >
                                            Città
                                        </label>

                                        <div className="mt-2">
                                            <input
                                                aria-label="Inserisci la tua città per creare il tuo account."
                                                type="text"
                                                autoComplete="off"
                                                className={`input ${
                                                    errors.register_city
                                                        ? "input-error"
                                                        : "input-primary"
                                                } w-full`}
                                                id="register_city"
                                                {...register("register_city", {
                                                    required: "Città richiesta",
                                                    pattern: {
                                                        // eslint-disable-next-line
                                                        value: /^[A-Z]+$/i,
                                                        message:
                                                            "Inserisci una città valida",
                                                    },
                                                })}
                                                placeholder="Milano"
                                            />
                                        </div>

                                        {/* Errore */}
                                        {errors.register_city && (
                                            <div className="mt-2">
                                                <span
                                                    role="alert"
                                                    className=" text-error"
                                                >
                                                    {
                                                        errors.register_city
                                                            .message
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Codice postale */}
                                    <div className="pt-5">
                                        <label
                                            htmlFor="register_cap"
                                            className="font-medium"
                                        >
                                            CAP
                                        </label>

                                        <div className="mt-2">
                                            <input
                                                aria-label="Inserisci il codice postale per creare il tuo account."
                                                type="text"
                                                autoComplete="off"
                                                className={`input ${
                                                    errors.register_cap
                                                        ? "input-error"
                                                        : "input-primary"
                                                } w-full`}
                                                id="register_cap"
                                                {...register("register_cap", {
                                                    required: "CAP richiesto",
                                                    pattern: {
                                                        // eslint-disable-next-line
                                                        value: /\b\d{5}\b/g,
                                                        message:
                                                            "Inserisci un CAP valido",
                                                    },
                                                })}
                                                placeholder="Ad esempio 20121"
                                            />
                                        </div>

                                        {/* Errore */}
                                        {errors.register_cap && (
                                            <div className="mt-2">
                                                <span
                                                    role="alert"
                                                    className=" text-error"
                                                >
                                                    {
                                                        errors.register_cap
                                                            .message
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Data di nascita */}
                                <div className="flex items-center justify-evenly gap-2">
                                    {/* Giorno */}
                                    <div className="pt-5">
                                        <label
                                            aria-label="Inserisci il tuo giorno di nascita per creare il tuo account."
                                            htmlFor="register_day"
                                            className="font-medium"
                                        >
                                            Giorno
                                        </label>

                                        <div className="mt-2">
                                            <Controller
                                                control={control}
                                                name="register_day"
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
                                                                errors.register_day &&
                                                                "1px solid #ff5724",
                                                            boxShadow:
                                                                errors.register_day &&
                                                                "none",
                                                        }}
                                                        id="register_day"
                                                        name="register_day"
                                                        min={1}
                                                        max={maxDays}
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        value={value}
                                                        ref={ref}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Errore */}
                                        {errors.register_day && (
                                            <div className="mt-2">
                                                <span
                                                    role="alert"
                                                    className=" text-error"
                                                >
                                                    {
                                                        errors.register_day
                                                            .message
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mese */}
                                    <div className="pt-5">
                                        <label
                                            aria-label="Inserisci il tuo mese di nascita per creare il tuo account."
                                            htmlFor="register_month"
                                            className="font-medium"
                                        >
                                            Mese
                                        </label>

                                        <div className="mt-2">
                                            <Controller
                                                control={control}
                                                name="register_month"
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
                                                                errors.register_month &&
                                                                "1px solid #ff5724",
                                                            boxShadow:
                                                                errors.register_month &&
                                                                "none",
                                                        }}
                                                        id="register_month"
                                                        name="register_month"
                                                        min={1}
                                                        max={12}
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        value={value}
                                                        ref={ref}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Errore */}
                                        {errors.register_month && (
                                            <div className="mt-2">
                                                <span
                                                    role="alert"
                                                    className=" text-error"
                                                >
                                                    {
                                                        errors.register_month
                                                            .message
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Anno */}
                                    <div className="pt-5">
                                        <label
                                            aria-label="Inserisci il tuo anno di nascita per creare il tuo account."
                                            htmlFor="register_year"
                                            className="font-medium"
                                        >
                                            Anno
                                        </label>

                                        <div className="mt-2">
                                            <Controller
                                                control={control}
                                                name="register_year"
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
                                                                errors.register_year &&
                                                                "1px solid #ff5724",
                                                            boxShadow:
                                                                errors.register_year &&
                                                                "none",
                                                        }}
                                                        id="register_year"
                                                        name="register_year"
                                                        min={1930}
                                                        max={
                                                            new Date().getFullYear() -
                                                            1
                                                        }
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        value={value}
                                                        ref={ref}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Errore */}
                                        {errors.register_year && (
                                            <div className="mt-2">
                                                <span
                                                    role="alert"
                                                    className=" text-error"
                                                >
                                                    {
                                                        errors.register_year
                                                            .message
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>{" "}
                                {/* Sesso */}
                                <div className="pt-5">
                                    <label
                                        aria-label={`${!gender ? "Per favore seleziona il tuo genere per creare il tuo account." : `Genere selezionato: ${gender === "male" ? "Maschio" : "Femmina"}`}. Utilizza le frecce per cambiare.`}
                                        id="register_gender_label"
                                        className="font-medium"
                                    >
                                        Genere
                                    </label>

                                    <div className="mt-2">
                                        <Controller
                                            control={control}
                                            name="register_gender"
                                            rules={{
                                                required: "Genere richiesto",
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
                                                    name="register_gender"
                                                    onChange={onChange}
                                                    ref={ref}
                                                    value={value}
                                                    onBlur={onBlur}
                                                >
                                                    <Radio
                                                        style={{
                                                            padding: "0.5rem",
                                                            border: errors.register_gender
                                                                ? "1px solid #ff5724"
                                                                : "1px solid #0ed3cf",
                                                            boxShadow:
                                                                errors.register_gender &&
                                                                "none",
                                                        }}
                                                        value={"male"}
                                                        aria-labelledby="register_gender_label"
                                                    >
                                                        Maschio
                                                    </Radio>
                                                    <Radio
                                                        style={{
                                                            padding: "0.5rem",
                                                            border: errors.register_gender
                                                                ? "1px solid #ff5724"
                                                                : "1px solid #0ed3cf",
                                                            boxShadow:
                                                                errors.register_gender &&
                                                                "none",
                                                        }}
                                                        value={"female"}
                                                        aria-labelledby="register_gender_label"
                                                    >
                                                        Femmina
                                                    </Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                    </div>

                                    {/* Errore */}
                                    {errors.register_gender && (
                                        <div className="mt-2">
                                            <span
                                                role="alert"
                                                className=" text-error"
                                            >
                                                {errors.register_gender.message}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8">
                                {/* Registra */}
                                <input
                                    aria-label="Crea il tuo account"
                                    type="submit"
                                    value="Crea account"
                                    style={{ color: "#fff" }}
                                    className={`btn ${
                                        checkErrors()
                                            ? "btn-error"
                                            : "btn-primary"
                                    } btn-block normal-case`}
                                />
                            </div>
                            {/* Login */}
                            <div className="w-full flex items-center justify-center mt-4">
                                <Link
                                    aria-label="Vai alla pagina di login se hai già un account."
                                    to="/login"
                                    className="text-sm text-center"
                                >
                                    <span className="underline">
                                        Hai già un account? Accedi
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </Spin>
                </form>
            </div>
        </div>
    );
};

export default RegisterScreen;

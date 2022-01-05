import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//react hook form
import { useForm } from "react-hook-form";

//antd
import { Divider, Spin, message } from "antd";

//redux
import { loginAction } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";

const LoginScreen = (props) => {
    //useform stuff
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    //redux stuff
    const user = useSelector((state) => state.user);
    const { error, isLoading, authToken } = user;
    const dispatch = useDispatch();

    //stato
    const [passwordVisible, setPasswordVisible] = useState(false);

    //form
    const onSubmit = (data) => {
        dispatch(loginAction(data.login_email, data.login_password));
    };

    useEffect(() => {
        error && message.error({
            content: <span role="alert">{error}</span>,
            duration: 5
        })
        error && dispatch({
            type: 'RESET_ERROR_USER',
        })
    }, [error, dispatch])

    useEffect(() => {
        authToken && props.history.push("/");
    }, [props.history, authToken])

    return (
        <div
            style={{ minHeight: "640px", height: "calc(100vh - 5rem)" }}
            className="flex"
        >
            {/* Immagine */}
            <div className="w-1/2 hidden md:block h-full">
                <img
                    className=" w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1550353127-b0da3aeaa0ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                    alt=""
                />
            </div>

            <div
                style={{ padding: "0% 4%" }}
                className="w-full md:w-1/2 flex flex-col"
            >
                <span className="mt-16"></span>
                <h2 className="text-4xl text-center">
                    <span>Bentornato</span>
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=" w-full max-w-md bg-base-300 rounded-md shadow-md relative left-1/2 -translate-x-1/2 overflow-hidden"
                >
                    <Spin spinning={isLoading}>
                        <div className="p-5">
                            {/* Email */}
                        <div className="pt-5 flex-col flex">
                            <label
                                htmlFor="login_email"
                                className="font-medium"
                            >
                                Email
                            </label>

                            <div className="mt-2">
                                <input
                                    aria-label="Inserisci la tua mail per accedere al tuo account."
                                    type="text"
                                    autoComplete="off"
                                    className={`input ${
                                        errors.login_email
                                            ? "input-error"
                                            : "input-primary"
                                    } w-full`}
                                    id="login_email"
                                    {...register("login_email", {
                                        required: "Email-richiesta",
                                    })}
                                    placeholder="Inserisci l'e-mail"
                                />
                            </div>

                            {/* Errore */}
                            {errors.login_email && (
                                <div className="mt-2">
                                    <span role="alert" className=" text-error">
                                        Per favore inserisci la tua mail
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mt-5">
                            <label
                                htmlFor="login_password"
                                className="font-medium"
                            >
                                Password
                            </label>

                            <div className="flex mt-2 relative">
                                <input
                                    aria-label="Inserisci la tua password per accedere al tuo account."
                                    autoComplete="off"
                                    type={passwordVisible ? "text" : "password"}
                                    {...register("login_password", {
                                        required: "Inserisci una password",
                                    })}
                                    className={`input ${
                                        errors.login_password
                                            ? "input-error"
                                            : "input-primary"
                                    } w-full`}
                                    id="login_password"
                                    placeholder="Inserisci la password"
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
                            {errors.login_password && (
                                <div className="mt-2">
                                    <span role="alert" className="text-error">
                                        Per favore inserisci la tua password
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            {/* Accedi */}
                            <input
                                disabled={isLoading}
                                aria-label="Accedi al tuo account"
                                type="submit"
                                value="Accedi"
                                style={{ color: "#fff" }}
                                className={`btn ${
                                    errors.login_password || errors.login_email
                                        ? "btn-error"
                                        : "btn-primary"
                                } btn-block normal-case`}
                            />
                        </div>

                        {/* Ripristina password */}

                        <div className="w-full flex items-center justify-center mt-4">
                            <Link
                                aria-label="Ripristina la tua password"
                                to="/forgotPassword"
                                className="text-sm text-center"
                            >
                                <span className="underline">
                                    Password dimenticata?
                                </span>
                            </Link>
                        </div>

                        <Divider />

                        {/* Crea nuovo account */}

                        <div className="w-full flex items-center justify-center mt-4">
                            <Link
                                to="/register"
                                className="text-sm text-center"
                            >
                                <button
                                    type="button"
                                    className="btn btn-secondary normal-case"
                                >
                                    <span className="text-secondary-content ">
                                        Crea nuovo account
                                    </span>
                                </button>
                            </Link>
                        </div>
                        </div>
                        
                    </Spin>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;

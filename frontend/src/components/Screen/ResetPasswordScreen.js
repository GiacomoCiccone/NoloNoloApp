import React, { useEffect, useState } from "react";

//react hook form
import { useForm } from "react-hook-form";

//antd
import { Spin, message } from "antd";

//redux
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "../Tooltip";

import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPasswordScreen = (props) => {
    //useform stuff
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    //redux stuff
    const user = useSelector((state) => state.user);
    const { authToken } = user;
    const dispatch = useDispatch();

    //stato
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);

    //form
    const onSubmit = async (data) => {
        if (disabled || isLoading) return
        try {
            setIsLoading(true);

            await axios.put(`/api/auth/resetPassword/${token}`, {
                password: data.reset_password_password,
            });

            setIsLoading(false);
            setDisabled(true);

            message.success({
                content: (
                    <span role="alert">
                        La password è stata ripristinata con successo.
                    </span>
                ),
                duration: 5,
            });
        } catch (error) {
            setIsLoading(false);
            setDisabled(true);
            setError(
                "Qualcosa è andato storto, prova a richiedere una nuova mail."
            );
        }
    };

    useEffect(() => {
        error &&
            message.error({
                content: <span role="alert">{error}</span>,
                duration: 5,
            });
        setError(null);
    }, [error, dispatch]);

    useEffect(() => {
        authToken && props.history.push("/");
    }, [props.history, authToken]);

    return (
        <div
            style={{
                minHeight: "640px",
                height: "calc(100vh - 5rem)",
                backgroundImage:
                    "url(https://images.unsplash.com/photo-1570342457566-0002e712eda3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
            }}
            className="flex justify-center bg-cover relative"
        >
            <div className="absolute w-full h-full backdrop-blur backdrop-brightness-90"></div>
            <div
                style={{ padding: "0% 4%" }}
                className="w-full md:w-1/2 flex flex-col mt-20 relative z-10"
            >
                <span className="mt-16"></span>
                <h2 className="text-4xl text-center">
                    <span className="text-primary-content">
                        Scegli la nuova password
                    </span>
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=" w-full max-w-md bg-base-300 rounded-md shadow-md relative left-1/2 -translate-x-1/2 overflow-hidden"
                >
                    <Spin spinning={isLoading}>
                        <div className="p-5">
                            {/* Password */}
                            <div className="mt-5">
                                <label
                                    htmlFor="reset_password_password"
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
                                        aria-label="Inserisci la tua nuova password di accesso."
                                        autoComplete="off"
                                        type={
                                            passwordVisible
                                                ? "text"
                                                : "password"
                                        }
                                        {...register(
                                            "reset_password_password",
                                            {
                                                required: "Password richiesta",
                                                pattern: {
                                                    // eslint-disable-next-line
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                                                    message:
                                                        "Inserisci una password valida",
                                                },
                                            }
                                        )}
                                        className={`input ${
                                            errors.reset_password_password
                                                ? "input-error"
                                                : "input-primary"
                                        } w-full`}
                                        id="reset_password_password"
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
                                {errors.reset_password_password && (
                                    <div className="mt-2">
                                        <span
                                            role="alert"
                                            className="text-error"
                                        >
                                            {
                                                errors.reset_password_password
                                                    .message
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8">
                                {/* Conferma password */}
                                <input
                                    aria-label={disabled ? "Prima di procedere richiedi una nuova mail." : "Conferma la tua nuova password."}
                                    type="submit"
                                    value="Conferma password"
                                    style={{ color: "#fff" }}
                                    className={`btn ${
                                        errors.reset_password_password
                                            ? "btn-error"    
                                            : "btn-primary"
                                    } btn-block normal-case`}
                                />
                            </div>
                        </div>
                    </Spin>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordScreen;

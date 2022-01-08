import React, { useEffect, useState } from "react";

//react hook form
import { useForm } from "react-hook-form";

//antd
import { Spin, message } from "antd";

//redux
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "../Tooltip";

import axios from "axios";

const ForgotPasswordScreen = (props) => {
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

    //form
    const onSubmit = async (data) => {

        if (isLoading) return

        try {

            setIsLoading(true);

            await axios.post("/api/auth/forgotPassword", {
                email: data.forgot_password_email,
            });

            setIsLoading(false);

            message.success({
                content: <span role="alert">L'email è stata inviata.</span>,
                duration: 5,
            });
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.error);
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
                    "url(https://images.unsplash.com/photo-1553949333-0510da388b82?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
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
                        Lasciati aiutare
                    </span>
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=" w-full max-w-md bg-base-300 rounded-md shadow-md relative left-1/2 -translate-x-1/2 overflow-hidden"
                >
                    <Spin spinning={isLoading}>
                        <div className="p-5">
                            {/* Email */}
                            <div className="pt-5">
                                <label
                                    htmlFor="forgot_password_email"
                                    className="font-medium"
                                >
                                    Email
                                </label>

                                {/* Tooltip forgot password*/}
                                <Tooltip
                                    color="blue"
                                    title="Inserisci la mail del tuo account. Invieremo a questa mail le istruzioni per ripristinare la tua password."
                                    icon="bi-info-circle-fill"
                                    type="info"
                                />

                                <div className="mt-2">
                                    <input
                                        aria-label="Inserisci la mail del tuo account, così che possiamo aiutarti."
                                        type="text"
                                        autoComplete="off"
                                        className={`input ${
                                            errors.forgot_password_email
                                                ? "input-error"
                                                : "input-primary"
                                        } w-full`}
                                        id="forgot_password_email"
                                        {...register("forgot_password_email", {
                                            required: "Email richiesta",
                                        })}
                                        placeholder="Inserisci l'e-mail"
                                    />
                                </div>

                                {/* Errore */}
                                {errors.forgot_password_email && (
                                    <div className="mt-2">
                                        <span
                                            role="alert"
                                            className=" text-error"
                                        >
                                            {
                                                errors.forgot_password_email
                                                    .message
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8">
                                {/* invia */}
                                <input
                                    aria-label="Recupera password"
                                    type="submit"
                                    value="Recupera password"
                                    style={{ color: "#fff" }}
                                    className={`btn ${
                                        errors.forgot_password_email
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

export default ForgotPasswordScreen;

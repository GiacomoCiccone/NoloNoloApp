import React from "react";
import notFoundSVG from "../../assets/undraw_towing_-6-yy4.svg";
import { Link } from "react-router-dom";

const NotFoundScreen = () => {
    return (
        <div
            style={{ minHeight: "100vh" }}
            className="flex items-center py-10 "
        >
            <div className="container flex gap-20 flex-col md:flex-row items-center justify-center px-5">
                <div className="max-w-md">
                    <div className="text-5xl font-dark font-bold">404</div>
                    <p className="text-2xl md:text-3xl font-light leading-normal">
                        Spiacenti, ciò che cercavi non si trova quì{" "}
                    </p>
                    <p className="mb-8">
                        Ma non ti preoccupare, ci sono molte altre cose che puoi
                        fare con noi!
                    </p>

                    <Link to="/">
                        <button className="px-4 inline py-2 text-sm font-medium leading-5 shadow btn btn-secondary">
                            <span className="text-secondary-content">
                                Torna alla home
                            </span>
                        </button>
                    </Link>
                </div>
                <div className="max-w-lg">
                    <img
                        className="w-full h-full object-contain"
                        src={notFoundSVG}
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFoundScreen;

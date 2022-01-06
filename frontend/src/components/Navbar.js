import React, { useState } from "react";

import { Link } from "react-router-dom";

import { Drawer, Divider } from "antd";

//components
import SwitchTheme from "./SwitchTheme";
import useWindowSize from "../utils/useWindowSize";
import Logo from "./Logo";

const Navbar = () => {
    const width = useWindowSize();
    const [showDrawer, setShowDrawer] = useState(false);

    return (
        <header
            style={{ padding: "0% 4%" }}
            className="fixed h-20 top-0 w-full bg-neutral flex justify-between items-center shadow-md z-50"
        >
            {/* Logo */}
            <div>
                <Logo />
            </div>

            {/* Bottoni */}
            <div className="flex items-center gap-2">
                <SwitchTheme />
                {true ? (
                    <>
                        {/* Accedi - Registrati */}
                        <div className="hidden md:flex gap-2">

                            <Link to="login" aria-label="Accedi al tuo account">
                            <button className="btn btn-primary" type="button" aria-hidden>
                            <span className="text-primary-content">
                                    Accedi
                                </span>
                            </button>
                                
                            </Link>
                            

                            <Link to="register" aria-label="Crea un account">
                            <button className="btn btn-primary btn-outline" type="button" aria-hidden>
                            <span >
                                   Registrati
                                </span>
                            </button>
                                
                            </Link>
                            
                            

                            
                        </div>

                        {/* Hamburger menu */}
                        <button
                            aria-label="Apri il menù"
                            className="btn btn-primary btn-md flex flex-col gap-1 md:hidden"
                            onClick={() => setShowDrawer(true)}
                        >
                            <div
                                style={{ height: "2px" }}
                                className="w-4 bg-primary-content"
                            ></div>
                            <div
                                style={{ height: "2px" }}
                                className="w-4 bg-primary-content"
                            ></div>
                            <div
                                style={{ height: "2px" }}
                                className="w-4 bg-primary-content"
                            ></div>
                        </button>
                    </>
                ) : (
                    <></>
                )}
            </div>

            <Drawer
                width={width < 400 ? "100%" : "70%"}
                title="Menù"
                placement="right"
                onClose={() => setShowDrawer(false)}
                visible={showDrawer}
                className="md:hidden"
            >
                {true ? (
                    <>
                        {/* Accedi - Registrati */}
                        <Link to="login" aria-label="Accedi al tuo account" style={{textDecoration: 'underline'}} onClick={() => setShowDrawer(false)}>Accedi</Link>
                        <Divider />
                        <Link to="register" aria-label="Crea un account" style={{textDecoration: 'underline'}} onClick={() => setShowDrawer(false)}>Registrati</Link>
                        <p className=" absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs">NoloNolo<sup>+</sup></p>
                    </>
                ) : (
                    <></>
                )}
            </Drawer>
        </header>
    );
};

export default Navbar;

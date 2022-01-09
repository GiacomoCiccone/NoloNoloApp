import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { Drawer, Divider, Dropdown, Menu } from "antd";

//redux
import { useDispatch, useSelector } from "react-redux";

//components
import SwitchTheme from "./SwitchTheme";
import useWindowSize from "../utils/useWindowSize";
import Logo from "./Logo";
import SearchDialog from "./SearchDialog";

const Navbar = () => {
    const location = useLocation();

    //redux stuff
    const user = useSelector((state) => state.user);
    const { authToken, userInfo } = user;
    const dispatch = useDispatch();

    const width = useWindowSize();
    const [showDrawer, setShowDrawer] = useState(false);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [currentDropDownSelected, setCurrentDropDownSelected] = useState(null);

    const [searchModalOpen, setSearchModalOpen] = useState(false)
    const handleModal = (val) => setSearchModalOpen(val)

    // Menu da loggato
    const loggedMenu = (
        <Menu
            id="navbarMenu"
            mode="inline"
            selectedKeys={[currentDropDownSelected]}
            style={{
                padding: "0",
                boxShadow: showDrawer
                    ? "none"
                    : "0px 5px 6px 2px rgba(0,0,0,0.15)",
                backgroundColor: showDrawer
                    ? "transparent"
                    : window.localStorage.getItem("theme") === "light"
                    ? "#fff"
                    : "#1f2937",
                minWidth: "15rem",
            }}
        >
            <Menu.Item style={{ padding: "1rem 1rem" }} key="account">
                <Link
                    aria-selected={currentDropDownSelected === 'account'}
                    aria-label="Vai al tuo account per visualizzare o modificare le tue informazioni personali."
                    to="/account"
                >
                    <span>
                        <i className="bi bi-person-circle mr-2" /> Vai a account
                    </span>
                </Link>
            </Menu.Item>
            <Divider style={{ margin: "0" }} />
            <Menu.Item style={{ padding: "1rem 1rem" }} key="rents">
                <Link
                    aria-selected={currentDropDownSelected === 'rents'}
                    aria-label="Visualizza la pagina dei tuoi noleggi."
                    to="/rents"
                >
                    <span>
                        <i className="bi bi-receipt mr-2" /> Vai a noleggi
                    </span>
                </Link>
            </Menu.Item>
            <Divider style={{ margin: "0" }} />
            <Menu.Item style={{ padding: "1rem 1rem" }} key="logout">
                <button
                    aria-label="Esci dal tuo account."
                    onClick={() => {
                        dispatch({
                            type: "LOGOUT_SUCCESS",
                        });
                    }}
                >
                    <span>
                        <i className="bi bi-door-open-fill mr-2" /> Esci
                    </span>
                </button>
            </Menu.Item>
        </Menu>
    );
    

    useEffect(() => {
        if (width < 768) {
            setDropDownOpen(false);
        } else {
            setShowDrawer(false);
        }
    }, [width]);

    useEffect(() => { //quando cambia il path aggiorna la voce selezionata e chiude i menu eventualmente aperti
        setCurrentDropDownSelected(location.pathname.substring(1));
        setDropDownOpen(false)
        setShowDrawer(false)
    }, [location.pathname]);

    return (
        <header
            style={{ padding: "0% 4%" }}
            className="fixed h-20 top-0 w-full bg-neutral flex justify-between items-center shadow-md z-50"
        >
            {/* Logo */}
            <div>
                <Logo />
            </div>

            {/* nuova ricerca solo non in home*/}
            {location.pathname !== "/" && <div>
                <button aria-label="Clicca per effettuare una nuova ricerca." onClick={() => setSearchModalOpen(true)} className="btn rounded-full btn-secondary sm:w-24" type="button">

                <i class="bi bi-search text-secondary-content text-2xl"></i>
                </button>
                <SearchDialog visible={searchModalOpen} setVisible={handleModal} />
            </div>}

            {/* Bottoni */}
            <div className="flex items-center gap-2">
                <SwitchTheme />
                {!authToken ? (
                    <>
                        {/* Accedi - Registrati */}
                        <div className="hidden md:flex gap-2">
                            <Link to="/login" aria-label="Accedi al tuo account">
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    aria-hidden
                                >
                                    <span className="text-primary-content">
                                        Accedi
                                    </span>
                                </button>
                            </Link>

                            <Link to="/register" aria-label="Crea un account">
                                <button
                                    className="btn btn-primary btn-outline"
                                    type="button"
                                    aria-hidden
                                >
                                    <span>Registrati</span>
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
                    <>
                        {/* Utente loggato */}
                        <div className="hidden md:flex gap-2">
                                <Dropdown
                                    placement="bottomCenter"
                                    trigger={["click"]}
                                    overlay={loggedMenu}
                                    visible={dropDownOpen}
                                    onVisibleChange={(visible) =>
                                        setDropDownOpen(visible)
                                    
                                    }
                                >
                                    <button
                                    aria-label={`Ciao ${userInfo.first_name}. ${dropDownOpen ? "Clicca per chiudere il menù" : "Clicca per aprire il menù"}`}
                                        type="button"
                                        className="btn rounded-full btn-primary"
                                    >
                                        <span className="text-primary-content">
                                            Ciao, {userInfo.first_name}{" "}
                                            <i
                                                className={`bi bi-caret-${
                                                    dropDownOpen ? "up" : "down"
                                                }-fill ml-2`}
                                            />
                                        </span>
                                    </button>
                                </Dropdown>
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
                )}
            </div>

            <Drawer
                width={width < 400 ? "100%" : "70%"}
                title={authToken ? `Menù di ${userInfo.first_name}` : "Menù"}
                placement="right"
                onClose={() => setShowDrawer(false)}
                visible={showDrawer}
                className="md:hidden"
                bodyStyle={{ padding: authToken ? "0" : "2rem" }}
            >
                {!authToken ? (
                    <>
                        {/* Accedi - Registrati */}
                        <Link
                            to="/login"
                            aria-label="Accedi al tuo account"
                            style={{ textDecoration: "underline" }}
                            onClick={() => setShowDrawer(false)}
                        >
                            Accedi
                        </Link>
                        <Divider />
                        <Link
                            to="/register"
                            aria-label="Crea un account"
                            style={{ textDecoration: "underline" }}
                            onClick={() => setShowDrawer(false)}
                        >
                            Registrati
                        </Link>
                        <p className=" absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs">
                            NoloNolo<sup>+</sup>
                        </p>
                    </>
                ) : (
                    <>{loggedMenu}</>
                )}
            </Drawer>
        </header>
    );
};

export default Navbar;

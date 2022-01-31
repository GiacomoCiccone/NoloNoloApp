import React from "react";

const Footer = () => {
    return (
        <footer className="p-4 footer bg-base-300 text-base-content footer-center border-t border-opacity-10">
            <div>
                <ul style={{margin: '0'}} className="flex gap-10 list-none items-center">
                    <li><a aria-label="Clicca per andare all'app frontend di NoloNolo plus." href="/">NoloNolo<sup>+</sup> <i className="bi bi-laptop"></i></a></li>
                    <li><a aria-label="Clicca per andare all'app admin di NoloNolo plus." href="/back-office/">Admin <i className="bi bi-building"></i></a></li>
                    <li><a aria-label="Clicca per andare all'app dashboard di NoloNolo plus." href="/dashboard/">Manager <i className="bi bi-graph-up-arrow"></i></a></li>
                    
                </ul>

                <p style={{marginTop: "0.5rem"}} >
                    Copyright © 2021 - All rights reserved by NoloNolo<sup>+</sup>
                </p>
            </div>
        </footer>
    );
};

export default Footer;

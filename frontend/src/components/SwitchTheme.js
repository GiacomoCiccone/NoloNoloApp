//react
import React, { useEffect, useState } from "react";

const SwitchTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || "light");

    useEffect(() => {
        if (theme === 'light') {
          document.body.classList.remove('dark');
          document.body.classList.add('light');
        } else {
          document.body.classList.remove('light');
          document.body.classList.add('dark');
        }
        document.body.parentNode.setAttribute("data-theme", theme);
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <button
            aria-label={`Clicca per cambiare tema. Tema attuale ${theme === "light" ? "Chiaro" : "Scuro"}`}
            className="btn btn-ghost border rounded btn-md"
            onClick={() =>
                setTheme((theme) => (theme === "light" ? "dark" : "light"))
            }
        >
            <i className={`bi bi-${theme === "light" ? "sun-fill" : "moon-fill"}`} />
        </button>
    );
};

export default SwitchTheme;

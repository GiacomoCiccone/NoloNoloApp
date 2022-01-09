//react
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SwitchTheme = () => {

    //redux stuff
    const userPreferences = useSelector((state) => state.userPreferences); //in questo modo stiamo prendendo le informazioni nello stato relative all'user
    const dispatch = useDispatch(); //il dispatch ci permette di inviare un'azione al reducer

    //stato del tema attuale
    const [theme, setTheme] = useState(userPreferences.theme);

     //inverte il tema
     const changeTheme = () => {
        if (theme === "light") {
            setTheme("dark");

        } else {
            setTheme("light");
            
        }

        dispatch({type: "CHANGE_THEME"})
    };



    useEffect(() => {
        if (theme === 'light') {
          document.body.classList.remove('dark');
          document.body.classList.add('light');
        } else {
          document.body.classList.remove('light');
          document.body.classList.add('dark');
        }
        document.body.parentNode.setAttribute("data-theme", theme);
        
    }, [theme, dispatch])

    return (
        <button
            aria-label={`Clicca per cambiare tema. Tema attuale ${theme === "light" ? "Chiaro" : "Scuro"}`}
            className="btn btn-ghost border rounded btn-md"
            onClick={changeTheme}
        >
            <i className={`bi bi-${theme === "light" ? "sun-fill" : "moon-fill"}`} />
        </button>
    );
};

export default SwitchTheme;

/** Appena il documento viene caricato, è necessario controllare che l'utente
 *  si sia loggato.
 */
$(document).ready(() => {
    // in caso non ci sia token, fa il redirect
    if (window.localStorage.getItem('token') == null){
        window.location.replace("./login.html");
    }
});


/** Permette il logout.
 * 
 */
$(document).on('click','#login-exit', function () { // jquery delegation
    window.localStorage.clear();
    window.location.replace("./login.html");
});


/** Verifica che l'utente abbia i permessi di eseguire tale azione.
 *  Altrimenti, refresha la pagina al login.
 *  Per fare ciò, esegue gli stessi passi delle altre funzioni
 */
function verifyAction(){
    if (window.localStorage.getItem('token') == null){
        window.location.replace("./login.html");
        return false;
    }
}
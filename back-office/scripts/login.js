/** Gestisce il login alla pagina del backoffice.
 * 
 */ 

/** Queste tre righe esistono per poter permettere il submit sia tramite invio 
 *  (chiamando la funzione con onSubmit) e tramite il pulsante apposito.
 */
$(document).on('click','#login-submit', function () { // jquery delegation
    checkLogin();  
});


/** Esegue sia il login che la registrazione dell'admin.
 *  
 */
function checkLogin(){
    var email = $('#login-email').val();
    var pw = $('#login-pw').val();
    var mystorage = window.localStorage;
    $('#error-msg').css('display', 'none')

    var fetchedToken;
    const fetchToken = async () => {
        try { // proviamo a vedere se le credenziali ci sono già nel server
            let token = await fetch('http://localhost:8000/api/auth/loginAdmin/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({ email: email, password: pw})
            });
            if (!token.ok) throw new Error("erroraccio");
            else { // in caso sia tutto apposto, ci salviamo il token e i dati dell'utente
                fetchedToken = await token.json();
                mystorage.setItem('token', fetchedToken.data.authToken);
                mystorage.setItem('user_info', JSON.stringify(fetchedToken.data.userInfo));
                window.location.replace("./");
            }
        } catch(error) {
            try{ // altrimenti, proviamo a registrare l'utente 
                 // (in caso l'utente non ci sia tra gli utenti "normali", dà errore)
                let token = await fetch('http://localhost:8000/api/auth/registerAdmin/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    mode: 'cors',
                    cache: 'default',
                    body: JSON.stringify({ email: email, password: pw})
                })
                if (!token.ok) throw new Error("erroraccio");
                else { // Se l'utente c'è, allora lo trasformo in un admin...
                    fetchedToken = await token.json();
                    mystorage.setItem('token', fetchedToken.data.authToken);
                    mystorage.setItem('user_info', JSON.stringify(fetchedToken.data.userInfo));
                    alert("Nuovo admin registrato con successo!");
                    window.location.replace("./");
                }
            }catch(err){ // ...sennò, errore!
                $('#error-msg').css('display', 'block')
                $('#error-msg').text("Errore: account non trovato. Ti sei registrato su NoloNolo+?");
            }
        }
    }

    return fetchToken();
}


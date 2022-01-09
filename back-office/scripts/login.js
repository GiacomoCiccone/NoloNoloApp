$(document).on('click','#login-submit', function () { // jquery delegation
    checkLogin(); // l'ho messo qui così non ci sono problemi se uno volessi fare una query premento invio
});


// versione momentanea del codice di login in base a dati in json.
function checkLogin(){
    var email = $('#login-email').val();
    var pw = $('#login-pw').val();
    var mystorage = window.localStorage;
    $('#error-msg').css('display', 'none')

    var fetchedToken;
    const fetchToken = async () => {
        try {
            let token = await fetch('http://localhost:8000/api/auth/loginAdmin/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({ email: email, password: pw})
            });
            if (!token.ok) throw new Error("erroraccio");
            else {
                fetchedToken = await token.json();
                mystorage.setItem('token', fetchedToken.data.authToken);
                mystorage.setItem('user_info', JSON.stringify(fetchedToken.data.userInfo));
                window.location.replace("./");
            }
        } catch(error) {
            try{
                let token = await fetch('http://localhost:8000/api/auth/registerAdmin/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    mode: 'cors',
                    cache: 'default',
                    body: JSON.stringify({ email: email, password: pw})
                })
                if (!token.ok) throw new Error("erroraccio");
                else {
                    fetchedToken = await token.json();
                    mystorage.setItem('token', fetchedToken.authToken);
                    mystorage.setItem('user_info', JSON.stringify(fetchedToken.userInfo));
                    alert("Nuovo admin registrato con successo!");
                    window.location.replace("./");
                }
            }catch(err){
                $('#error-msg').css('display', 'block')
                $('#error-msg').text("Errore: account non trovato. Ti sei registrato su NoloNolo+?");
            }
        }
    }

    return fetchToken();
}


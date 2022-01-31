/** Renderizza le entry all'avvio della pagina.
 */
$(document).ready(function(){
    updateDisplayedEntries(); 
});

/** Evidenzia l'elemento della sidebar selezionato.
 *  Chiamato dentro load_ui_essentials.js
 */
 function highlightSidebarEntry(){
    $("#sidebar-rents").addClass("selected");
}


/**  Crea il bottone di aggiunta in base al contesto della pagina (in questo caso prentoazioni)
 *   Aggiunge anche una bellissima barra di ricerca.
 *
 */
function loadAddButton(){
    $('#add-button').html('<i class="fas fa-plus"></i>&nbsp; ' + "Agg. prenotazione");
    $('#search-bar').load('components/rents/rentssearchbar.html');
}

/** Carica i modali per l'aggiunta delle prenotazioni
 */
$(document).ready(function () { // jquery delegation
    verifyAction();

    $(document).on('click','#add-button', function () { // jquery delegation
        // apre menu e aggiunge classe
        $('.modal-dialog').addClass('modal-lg');
        $('#multiUseModal').modal('toggle');

        (async () => { 
            // riempie le select
            let kits = await fetchSecondaryDataFromServer('kits/');
            let cars = await fetchSecondaryDataFromServer('cars/');
            let users = await fetchSecondaryDataFromServer('users/');
            // loading form html
            $('.modal-content').load("components/rents/rentsform.html", () => {

                // aggiungi event listener per mostrare la data di non disponibilità
                $('input[name=rentType]').change(function() {
                    if (this.value == 'period') {
                        $('#classicRentDiv').addClass('hidden');
                        $('#periodicRentDiv').removeClass('hidden');
                    } else {
                        $('#periodicRentDiv').addClass('hidden');
                        $('#classicRentDiv').removeClass('hidden');
                    }
                });

                displayAutoSelect(cars.data);
                displayKitsSelect(kits.data);
                displayUsersSelect(users.data);
            })
        })();
    });
});


/** Carica la ui del modale e i dati prendendoli dalla sessione corrente.
 *  Dopodiché, lo apre.
 *  Versione delle auto.
 */
function loadDetailsById(id){ 
    $('.modal-dialog').addClass('modal-lg');

    // turnaround per la presenza di solo l'id dentro mongodb
    let full_kits_list = window.sessionStorage.getItem('latest_kits/_fetch');
    let full_pickup_list = window.sessionStorage.getItem('latest_pickups/_fetch');


    $('.modal-content').load("components/rents/modifyrents.html", () => {

        // aggiungi event listener per mostrare la data di non disponibilità
        $('input[name=rentType]').change(function() {
            if (this.value == 'period') {
                $('#classicRentDiv').addClass('hidden');
                $('#periodicRentDiv').removeClass('hidden');
            } else {
                $('#periodicRentDiv').addClass('hidden');
                $('#classicRentDiv').removeClass('hidden');
            }
        });
        
        // prendi la variabile di stato dalla sessione
        let data = window.sessionStorage.getItem("latest_fetch"); 
        
        // riempi ogni campo del menu della descrizioni
        $.each(JSON.parse(data), function(key, val) {
            if (val._id === id.toString()){
                // mettere valori dentro a key

                
                // data creazione e ultima modifica
                $('#creation-date').text(val.createdAt);
                $('#change-date').text(val.updatedAt);
                
                // Informazioni utente
                $("#username-rent-value").text(val.customer.username);
                
                // Nome + info utente
                $("#user-name").text(val.customer.first_name + ' ' + val.customer.last_name);
                $("#user-address").text(val.customer.address.via + ', ' + val.customer.address.city + ', ' +val.customer.address.postal_code);
                $("#user-email").text(val.customer.email);

                //id utente
                $('#user-id').text(val.customer._id);


                // now, on to the next section: cars!
                // Modello auto
                $('#car-rent-value').text(val.rentObj.car.model);
                
                // pickups e kits
                $('#kits-value').html("nessuno");
                let noKits = true;
                $.each(val.rentObj.kits, function(key, kit){
                    if (noKits == true)
                    {
                        noKits = false;
                        $('#kits-value').html('<ul id="kits-list"></ul>');
                    }
                    $.each(JSON.parse(full_kits_list), function(key, kit_store){
                        if (kit_store._id === kit)
                        $('#kits-list').append('<li>' + kit_store.name + '</li>');
                    })
                });

                $.each(JSON.parse(full_pickup_list), function(key, pickup_store){
                    if (pickup_store._id === val.rentObj.car.place)
                    $('#pickup-rent-value').text(pickup_store.point);
                })

                $('#car-id').text(val.rentObj.car._id);
        
                // Tipo prenotazione
                $("#rent-type-value").text(val.type);
                $("input[name=rentType][value=" + val.type + "]").attr('checked', 'checked');

                // informazione temporale
                let days_week = [0, "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"]
                if (val.type === 'classic') {
                    let from_date = val.classic.from
                    let to_date = val.classic.to
                    from_date = from_date.split('T')[0]
                    to_date = to_date.split('T')[0]
                    $('#rent-time-value').text('Prenotato dal ' + from_date + ' al ' + to_date);
                } else {
                    let string_date = val.period.since
                    string_date = string_date.split('T')[0]
                    if (val.period.singleDay){
                        $('#rent-time-value').text('Prenotato un giorno (' + days_week[val.period.from] + '), per ' + val.period.for + ' settimane, dal ' + string_date);
                    } else {
                        $('#rent-time-value').text('Prenotato da ' + days_week[val.period.from] + ' a ' + days_week[val.period.to] + ', per ' + val.period.for + ' settimane, dal ' + string_date);
                    }

                    $('#classicRentDiv').addClass('hidden');
                    $('#periodicRentDiv').removeClass('hidden');
                }
                
                // consegna in ritardo
                let late = true;
                if (val.isLate == null || val.isLate === false) late = false;

                // data conclusione
                if (val.state === 'concluded' && val.concludedAt != null){
                    let string_date = val.concludedAt;
                    string_date = string_date.split('T')[0]
                    $("#conclusion-date").removeClass('hidden');
                    $("#conclusion-date-value").text(string_date);
                }

                // Booleans
                $("#rent-late-value").text(late)
                $("#isLate").attr('checked', late);
                
                // prezzo
                $("#rent-price-value").text(val.price);
                
                // id prenotazione
                $("#rent-id-value").text(val._id);
            }
        })
    });
}



/** Formula i dati di una nuova auto e li invia al server
 *  Versione delle auto.
 */
function createRent(){

    let _rent_kits = $('#kitsRent').val();
    let _car_id = $('#autoRent').val();
    let _user_id = $('#userRent').val();
    let _rent_status = $('#rentStatus').val()
    let _rent_type = document.querySelector('input[name="rentType"]:checked').value;
    let _classic = {from : null, to : null};
    let _period = {from : null, to : null, since: null, for: null, singleDay: null};
    let _rent_obj = {car: _car_id, kits: _rent_kits};

    if (_rent_type === 'classic'){
        _period = null;
        _classic.from = new Date($('#fromDate').val())
        _classic.to = new Date($('#toDate').val());
        if (_classic.from > _classic.to) {
            alert('invalid date for classic rent');
            return;
        }
    } else {
        _classic = null;
        
        let days_period = $('#weekDays').val();
        _period.since = new Date($('#sinceDate').val());
        _period.from = ((_period.since.getDay() + 6) % 7) + 1;
        _period.to = _period.from;
        for (let i = 0; i < days_period - 1; i++) {
            _period.to = _period.to + 1;
            if (_period.to === 8) {
                _period.to = 1;
            }
        }
        _period.for = $('#weekPeriod').val();
        _period.singleDay = (_period.from === _period.to);
    }

    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    
    let payload = {
        customer : _user_id, 
        rentObj : _rent_obj,
        state : _rent_status,
        type : _rent_type,
        classic : _classic,
        period : _period,
    };

    // console.log(JSON.stringify(payload));
    
    sendPayload(payload, 'rents/', user_token, 'POST');
}

/** Ritona la data di disponibilità in modo corretto
 * 
 */
function getUnavailDate(){
    let _unavaiable = {from : null, to: null};
    if (document.getElementById('notAvail').checked) { 
        _unavaiable.from = new Date($('#fromDate').val());
        if ($('#toDate').val() != ""){
            _unavaiable.to = new Date($('#toDate').val());
            if (_unavaiable.from > _unavaiable.to){
                // data non corretta... inizio > fine
                alert("invalid date: ignored");
                return null;
            }   
        }
        return _unavaiable;
    }
    return null;
}


/** Mostra il badge di status della prenotazione
 * 
 */
 function showStatusBadge(val){
    if (val === 'concluded')
        return '<span class="badge rounded-pill bg-success">Concluso</span>';
    else if (val === 'pending')
        return '<span class="badge rounded-pill bg-warning text-dark">Pending</span>';
    else if (val === 'accepted')
        return '<span class="badge rounded-pill bg-primary">Accettato</span>';
}

/** Mostra il pulsante associato alla entry in base allo stato
 * 
 */
 function showStatusButton(val){
    if (val === 'accepted')
        return '<a href="#" class="btn btn-success conclude-status-btn"><i class="fas fa-check"></i>&nbsp; Concludi</a>';
    else if (val === 'pending')
        return '<a href="#" class="btn btn-success accept-status-btn"><i class="fas fa-check"></i>&nbsp; Accetta</a>';
    else
        return '';
}

/** Mostra il pulsante associato alla entry in base allo stato
 * 
 */
 function showRentIsLate(val){
    if (val === true && val != undefined)
        return ' |<span class="text-danger"> In ritardo</span>';
    else return ''
}


/** Mostra i dati relativi ai macchine nella pagina.
 * 
 */
function displayData(data){
    $("#elements").html("");
    $.each(data, function(key, val) { 
        let image;
        if (val.image == null) image = 'https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/image' ;
        else image = val.image;
        
        let type; 
        if (val.type == 'classic') type = 'classico'; 
        else type = 'periodico'
        
        var element =             
        '<div tabindex="0" class="entry" data-entryid="' + val._id + '" data-carmodel="' + val.rentObj.car.model + '" data-status="' + val.state + '" >' +
        '<span class="sr-only"> Prenotazione di ' + val.customer.username + '. Contiene: </span>' + 
            '<div class="entry-image"><img src="' + val.rentObj.car.image + '" alt=""></div>' + 
            '<div class="entry-body">' +
                '<h5 class="entry-title">Prenotazione di \"' + val.customer.username + '\"&nbsp; ' + showStatusBadge(val.state) +
                '</h5>' + 
                '<p class="entry-text">Auto: '+ val.rentObj.car.model + ' | Tipo: ' + type + showRentIsLate(val.isLate) + '</p>' +
                '<p class="entry-text id-text">id: ' + val._id + '</p>' + 
                '<span class="sr-only"> Puoi scegliere se vedere maggiori info, o rimuovere la entry. </span>' + 
                '<a href="#" class="btn btn-primary details"><i class="fas fa-info-circle"></i>&nbsp; Più dettagli</a>' +
                showStatusButton(val.state) +
                '<a href="#" class="btn btn-danger removeAlert"><i class="fas fa-trash-alt"></i>&nbsp; Rimuovi</a>' +
            '</div>' +
        '</div>';
        $("#elements").append(element);
    });
}

/** Aggiorna le entries dei macchine sullo schermo
 * 
 */
function updateDisplayedEntries(){
    // mette la schermata di caricamento

    fetchDataFromServerBruteForce('kits/');
    fetchDataFromServerBruteForce('pickups/');
    
    var user_token = window.localStorage.getItem('token');
    $("#elements").load("components/loading-animation.html", () => {
        return fetchProtectedDataFromServer('rents/', user_token);
    });
}

/** Rimuove un pickup.
 *  Viene applicato quando si preme "si" al modale di rimozione.
 */
$(document).on('click','.remove',(e) => {
    // autorizza utente
    verifyAction();
    var user_token = window.localStorage.getItem('token');
    var id = $('#multiUseModal').data('id');

    // elimina e chiudi la modale
    sendPayload("", 'rents/' + id + '/', user_token, 'DELETE');
    $('#multiUseModal').modal('toggle');
    }
);



/** Modifica una macchina.
 * 
 */
$(document).on('click','#apply-modifications', (e) => {
    // autorizza utente
    verifyAction();

    let id = $('#multiUseModal').data('id');

    let _rent_isLate = $('#isLate').is(":checked")
    let _rent_type = document.querySelector('input[name="rentType"]:checked').value;
    let _classic = {from : null, to : null};
    let _period = {from : null, to : null, since: null, for: null, singleDay: null};

    if (_rent_type === 'classic'){
        _period = null;
        _classic.from = new Date($('#fromDate').val())
        _classic.to = new Date($('#toDate').val());
        if (_classic.from > _classic.to) {
            alert('invalid date for classic rent');
            return;
        }
    } else {
        _classic = null;
        
        let days_period = $('#weekDays').val();
        _period.since = new Date($('#sinceDate').val());
        _period.from = ((_period.since.getDay() + 6) % 7) + 1;
        _period.to = _period.from;
        for (let i = 0; i < days_period - 1; i++) {
            _period.to = _period.to + 1;
            if (_period.to === 8) {
                _period.to = 1;
            }
        }
        _period.for = $('#weekPeriod').val();
        _period.singleDay = (_period.from === _period.to);
    }

    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    
    let payload;
    if (sessionStorage.getItem('hasMadeChanges') == 1){
        payload = {
            isLate : _rent_isLate,
            type : _rent_type,
            classic : _classic,
            period : _period,
        }
    } else {
        payload = {
            isLate : _rent_isLate,
        }
    }
    
    sendPayload(payload, 'rents/' + id, user_token, 'PUT');
    }
);

/** Usata per mostrare solo le non deprecate.
 * 
 * 
 */
function carAvailability(val){
    if (val == null || Date.now() < new Date(val.from)){
        return 'available';
    } else {
        // se la data è minore 
        if (new Date(val.from) <= Date.now() && new Date(val.from) > new Date(1970, 1, 1))
        {
            if (val.to == null || new Date(val.to) >= Date.now())
                return 'unavailable';
            else
                return 'available';
        }
        else {
            return 'deprecato';
        }
    }
}

/** Mostra gli auto nella select di creazione
 * 
 */
function displayAutoSelect(data){
    $.each(data, function(key, val) { 
        if (carAvailability(val.unavaiable) === 'available') {
            var element =   
            '<option value="' + val._id +'">' + val.model +', ' + val.condition + ', '+ val.place.point+ ', ' + val.basePrice + '€</option>';
            $("#autoRent").append(element);
        }
    });
}

/** Mostra gli utenti nella select di creazione
 * 
 */
function displayUsersSelect(data){
    $.each(data, function(key, val) { 
        var element =   
        '<option value="' + val._id +'">' + val.username + '</option>';
        $("#userRent").append(element);
    });
}

/** Mostra i kit che può selezionare per creare la prenotazione
 * 
 */
function displayKitsSelect(data){
    $.each(data, function(key, val) { 
        var element =   
        '<option value="' + val._id +'">' + val.name + '</option>';
        $("#kitsRent").append(element);
    });
}

/** Fetcha dei dati diversi dai rent dal server
 * 
 */
async function fetchSecondaryDataFromServer(url){
    var user = window.localStorage.getItem('token');
    try {
        let res = await fetch('http://localhost:8000/api/' + url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                    'Authorization': "Bearer " + user   
            },
            mode: 'cors',
            cache: 'default',
        });
        if (!res.ok) throw new Error("erroraccio");
        else {
            return await res.json(); 
        }
    } catch(error) {
        console.log("couldnt fetch secondary data from " + url);
    }
}

/** Riprisitna le dimensioni del modale quando viene chiuso
 * 
 */
$(document).on('hidden.bs.modal','#multiUseModal', function () {
    $('.modal-dialog').removeClass("modal-lg");
})

/** Questa funzione è una copia trita delle altre funzioni di fetch. Cambia davvero di poco.
 *  L'unica cosa è che mette le cose in session storage dopo averle fetchate. 
 */
function fetchDataFromServerBruteForce(url){
    const fetchdata = async () => {
        try {
            let res = await fetch('http://localhost:8000/api/' + url, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                cache: 'default',
            });
            if (!res.ok) throw new Error("erroraccio");
            else {
                fetchedData = await res.json();
                window.sessionStorage.setItem("latest_" + url + "_fetch", JSON.stringify(fetchedData.data));
            }
        } catch(error) {
            console.log("couldnt fetch data");
        }
    }
    return fetchdata();
}

/** Azioni da eseguire quando si preme il tasto conferma per il checkbox
 * 
 */
 $(document).on('click','.confirm-date-rent',(e) => {
    // autorizza utente
    verifyAction();

    // mostra il pulsante "applica modifiche" solo se si è fatta una modifica 
    if (sessionStorage.getItem('hasMadeChanges') !== 1) { 
        sessionStorage.setItem('hasMadeChanges', 1);
        $("#apply-modifications").removeClass('hidden');
    }

    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 

    let _rent_type = document.querySelector('input[name="rentType"]:checked').value;
    let _classic = {from : null, to : null};
    let _period = {from : null, to : null, since: null, for: null, singleDay: null};

    // cambia i valori della UI
    if (_rent_type === 'classic'){
        _period = null;
        _classic.from = $('#fromDate').val()
        _classic.to = $('#toDate').val();
        if (_classic.from > _classic.to) {
            alert('invalid date for classic rent');
            return;
        }
    } else {
        _classic = null;
        
        let days_period = $('#weekDays').val();
        _period.since = new Date($('#sinceDate').val());
        _period.from = ((_period.since.getDay() + 6) % 7) + 1;
        _period.to = _period.from;
        for (let i = 0; i < days_period - 1; i++) {
            _period.to = _period.to + 1;
            if (_period.to === 8) {
                _period.to = 1;
            }
        }
        _period.for = $('#weekPeriod').val();
        _period.singleDay = (_period.from === _period.to);
    }

    // Tipo prenotazione
    $("#rent-type-value").text(_rent_type);

    // informazione temporale
    let days_week = [0, "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"]
    if (_rent_type === 'classic') {
        let from_date = _classic.from
        let to_date = _classic.to
        $('#rent-time-value').text('Prenotato dal ' + from_date + ' al ' + to_date);
    } else {
        let string_date = _period.since
        string_date = string_date.split('T')[0]
        if (_period.singleDay){
            $('#rent-time-value').text('Prenotato un giorno (' + days_week[_period.from] + '), per ' + _period.for + ' settimane, dal ' + string_date);
        } else {
            $('#rent-time-value').text('Prenotato da ' + days_week[_period.from] + ' a ' + days_week[_period.to] + ', per ' + _period.for + ' settimane, dal ' + string_date);
        }

        $('#classicRentDiv').addClass('hidden');
        $('#periodicRentDiv').removeClass('hidden');
    }


    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides confirm button
    }
);


/** Modifica il tipo del rent, con data etc 
 * 
 */
 $(document).on('click','.confirm-late-rent',(e) => {
    // autorizza utente
    verifyAction();

    // mostra il pulsante "applica modifiche" solo se si è fatta una modifica 
    $("#apply-modifications").removeClass('hidden');

    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 

    let late = $('#isLate').is(":checked");

    // cambia i valori della UI
    $("#rent-late-value").text(late);

    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides conferma button
    }
);

$(document).on('click','.conclude-status-btn',(e) => {
    // autorizza utente
    verifyAction();
    let id = $(e.currentTarget).closest("[data-entryid]").data("entryid"); 
    let user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    
    let payload = {
        state : 'concluded',
    };
    sendPayload(payload, 'rents/' + id, user_token, 'PUT');

    }
);
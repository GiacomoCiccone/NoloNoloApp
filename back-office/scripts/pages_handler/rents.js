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
    $('#search-bar').load('../components/rents/rentssearchbar.html');
}

/** Carica i modali per l'aggiunta delle prenotazioni
 */
$(document).ready(function () { // jquery delegation
    verifyAction();

    $(document).on('click','#add-button', function () { // jquery delegation
        // mostra i pickup nel select relativo
        (async () => { 
            let pickups = await fetchPickupsFromServer();
            // loading form html
            $('.modal-content').load("../components/rents/rentsform.html", () => {
                $('.modal-dialog').addClass('modal-lg');

                // aggiungi event listener per mostrare la data di non disponibilità
                $('input[id=notAvail]').change(function() {
                    if ($(this).is(':checked')) {
                        $('#dateNavail').removeClass('hidden');
                    } else {
                        $('#dateNavail').addClass('hidden');
                    }
                });

                displayPickupsSelect(pickups.data);
                // opening menu
                $('#multiUseModal').modal('toggle');
            })
        })();
    });
});


/** Carica la ui del modale e i dati prendendoli dalla sessione corrente.
 *  Dopodiché, lo apre.
 *  Versione delle auto.
 */
function loadDetailsById(id){ 
    (async () => { let pickups = await fetchPickupsFromServer();
        $('.modal-dialog').addClass('modal-lg');
        $('.modal-content').load("../components/rents/modifyrents.html", () => {

            // aggiunge l'event listener per il checkbox
            $('input[id=notAvail]').change(function() {
                if ($(this).is(':checked')) {
                    $('#dateNavail').removeClass('hidden');
                } else {
                    $('#dateNavail').addClass('hidden');
                }
            });
            
            // prendi la variabile di stato dalla sessione
            let data = window.sessionStorage.getItem("latest_fetch"); 
            
            displayPickupsSelect(pickups.data);

            // riempi ogni campo del menu della descrizioni
            $.each(JSON.parse(data), function(key, val) {
                if (val._id === id.toString()){
                    
                    // immagine auto
                    $("#car-image-value").text(val.image);
                    $("#autoImage").val(val.image);
                    // Modello e marca
                    let car_model = val.model.split(' ');
                    car_model = car_model.slice(1, car_model.length + 1);
                    $("#car-title-value").text(val.model);
                    $("#autoModel").val(car_model.join(' '));
                    $("#autoBrand").val(val.brand);
                    // Descrizione
                    $("#car-desc-value").text(val.description);
                    $("#autoDescription").val(val.description);

                    // Condizioni
                    $("#car-cond-value").text(val.condition);
                    $("input[name=selezioneCondizAuto][value=" + val.condition + "]").attr('checked', 'checked');


                    // Pickup
                    if (val.place != null){
                        $("#car-pickup-value").text(val.place.point);
                        $("#car-pickup-value").data("pickup_id", val.place._id);
                        $("#pickupPlace").val(val.place._id);
                    }
                    // Tag
                    $("#car-tag-value").text(val.tag);
                    $("#carTag").val(val.tag);
                    // Booleans
                    $("#car-bool-value-electric").text(val.isElectric)
                    $("#isElectric").attr('checked', val.isElectric);
                    $("#car-bool-value-automatic").text(val.hasAutomaticTransmission)
                    $("#hasAutomaticTransmission").attr('checked', val.hasAutomaticTransmission)
                    $("#car-bool-value-doors").text(val.hasThreeDoors)
                    $("#hasThreeDoors").attr('checked', val.hasThreeDoors);
                    
                    // posti
                    $("#car-seats-value").text(val.seats);
                    $("#seatsNumber").val(val.seats);
                    
                    // Bagagli
                    $("#car-bag-value").text(val.baggageSize);
                    $("#baggagesNumber").val(val.baggageSize);

                    // Prezzo
                    $("#car-price-value").text(val.basePrice);
                    $("#basePrice").val(val.basePrice);

                    // Id 
                    $("#car-id-value").text(val._id);

                    // Info prenotazione
                    if (val.unavaiable != null){
                        // mostra checkbox e date corrette
                        $("#notAvail").attr('checked', 'true')
                        $('#dateNavail').removeClass('hidden');

                        // mostra i campi delle date in modo corretto
                        let from_date = new Date(val.unavaiable.from);
                        var year = from_date.getUTCFullYear();

                        if (year < 1970) from_date.setFullYear(1969);
                        
                        let date_string = from_date.toISOString();
                        date_string = date_string.split('T')[0];
                        $('#fromDate').val(date_string);

                        $("#car-unavail-date").addClass('text-danger');
                        $("#car-unavail-date").removeClass('text-success');
                        $("#avail").val("Non disponibile dal &nbsp;");
                        $("#car-date-from").text(date_string);

                        if (val.unavaiable.to != null) {
                            $('#to-text').removeClass('hidden');
                            let to_date = new Date(val.unavaiable.to);

                            var year = to_date.getUTCFullYear();
                            
                            if (year < 1970) to_date.setFullYear(1969);
                            date_string = to_date.toISOString();
                            date_string = date_string.split('T')[0];
                            $("#car-date-to").text(date_string);
                            $('#toDate').val(date_string);
                        } else {
                            $('#to-text').addClass('hidden');
                            $("#car-date-to").text("");
                        }
                    } else {
                        $('#to-text').addClass('hidden');
                        $("#car-unavail-date").addClass('text-success');
                        $("#car-unavail-date").removeClass('text-danger');
                        $("#avail").text("Disponibile nel nostro magazzino");
                        $("#car-date-from").text("");
                        $("#car-date-to").text("");
                    }
                }
            })
        });
    })();
}



/** Formula i dati di una nuova auto e li invia al server
 *  Versione delle auto.
 */
function createCar(){
    let _img_url = $('#autoImage').val();
    let _model = $('#autoModel').val();
    let _brand = $('#autoBrand').val();
    let _cond = document.querySelector('input[name="selezioneCondizAuto"]:checked').value;
    let _pickup = $('#pickupPlace').val();
    let _tag =  $('#carTag').val();
    let _desc = $('#autoDescription').val();
    let _seats = $('#seatsNumber').val();
    let _isAutomatic = document.getElementById('hasAutomaticTransmission').checked;
    let _isThreeDoors = document.getElementById('hasThreeDoors').checked;
    let _bags = $('#baggagesNumber').val();
    let _isElec = document.getElementById('isElectric').checked;
    let _price = $('#basePrice').val();
    let _unavaiable = getUnavailDate();


    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    
    let payload = {
        image : _img_url, 
        model : _brand + " " + _model,
        brand : _brand,
        condition : _cond,
        place : _pickup,
        tag : _tag,
        description : _desc,
        seats : _seats,
        hasAutomaticTransmission : _isAutomatic,
        hasThreeDoors : _isThreeDoors,
        baggageSize : _bags,
        isElectric : _isElec,
        basePrice : _price,
        unavaiable : _unavaiable != null ? _unavaiable : undefined
    };

    console.log(JSON.stringify(payload));
    
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

/** Dice se una macchina è disponibile o no 
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

/** Mostra il badge di disponibilità
 * 
 */
 function showAvaiabilityBadge(val){
    if (val == null || Date.now() < new Date(val.from)){
        return '<span class="badge rounded-pill bg-success">In locazione</span>';
    } else {
        // se la data è minore 
        if (new Date(val.from) <= Date.now() && new Date(val.from) > new Date(1970, 1, 1))
        {
            if (val.to == null || new Date(val.to) >= Date.now())
                return '<span class="badge rounded-pill bg-danger">Fuori magazzino</span>';
            else
                return '<span class="badge rounded-pill bg-success">In locazione</span>';
        }
        else {
            return '<span class="badge rounded-pill bg-secondary">Deprecato</span>';
        }
    }

}




/** Mostra i dati relativi ai macchine nella pagina.
 * 
 */
function displayData(data){
    $("#elements").html("");
    $.each(data, function(key, val) { 
        var image;
        if (val.image == null) image = 'https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/image' ;
        else image = val.image;
        var element =             
        '<div tabindex="0" class="entry" data-entryid="' + val._id + '" data-avail="' + carAvailability(val.unavaiable) + '" >' +
        '<span class="sr-only"> Entri di ' + val.model + '. Contiene: </span>' + 
            '<div class="entry-image"><img src="' + image + '" alt=""></div>' + 
            '<div class="entry-body">' +
                '<h5 class="entry-title">' + val.model + '&nbsp; ' + showAvaiabilityBadge(val.unavaiable) +
                '</h5>' + 
                '<p class="entry-text">Condizioni: ' + val.condition + '</p>' + 
                '<p class="entry-text id-text">id: ' + val._id + '</p>' + 
                '<span class="sr-only"> Puoi scegliere se vedere maggiori info, o rimuovere la entry. </span>' + 
                '<a href="#" class="btn btn-primary details"><i class="fas fa-info-circle"></i>&nbsp; Più dettagli</a>' + '\n' +
                '<a href="#" class="btn btn-danger removeAlert"><i class="fas fa-trash-alt"></i>&nbsp; Rimuovi/Depreca</a>' +
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
    $("#elements").load("components/loading-animation.html");
    return fetchDataFromServer('rents/');
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
    sendPayload("", 'rentsù/' + id + '/', user_token, 'DELETE');
    $('#multiUseModal').modal('toggle');
    }
);



/** Modifica una macchina.
 * 
 */
$(document).on('click','#apply-modifications', (e) => {
    // autorizza utente
    verifyAction();

    let _img_url = $('#autoImage').val();
    let _model = $('#autoModel').val();
    let _brand = $('#autoBrand').val();
    let _cond = document.querySelector('input[name="selezioneCondizAuto"]:checked').value;
    let _pickup = $('#pickupPlace').val();
    let _tag =  $('#carTag').val();
    let _desc = $('#autoDescription').val();
    let _seats = $('#seatsNumber').val();
    let _isAutomatic = document.getElementById('hasAutomaticTransmission').checked;
    let _isThreeDoors = document.getElementById('hasThreeDoors').checked;
    let _bags = $('#baggagesNumber').val();
    let _isElec = document.getElementById('isElectric').checked;
    let _price = $('#basePrice').val();
    let id = $('#multiUseModal').data('id');
    let _unavaiable = getUnavailDate();


    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    
    let payload = {
        image : _img_url, 
        model : _brand + " " + _model,
        brand : _brand,
        condition : _cond,
        place : _pickup,
        tag : _tag,
        description : _desc,
        seats : _seats,
        hasAutomaticTransmission : _isAutomatic,
        hasThreeDoors : _isThreeDoors,
        baggageSize : _bags,
        isElectric : _isElec,
        basePrice : _price,
        unavaiable : _unavaiable != null ? _unavaiable : null
    };
    sendPayload(payload, 'rents/' + id, user_token, 'PUT');
    updateDisplayedEntries();
    }
);


/** Popola il select menu dedicato ai pickups
 * 
 */
function displayPickupsSelect(data){
    $("#pickupPlace").html('<option value="1" disabled selected hidden>Immetti un luogo di ritiro</option>');
    $.each(data, function(key, val) { 
        var element =   
        '<option value="' + val._id +'">' + val.point + '</option>';
        $("#pickupPlace").append(element);
    });
}

/** Fetcha i pickups dal server
 * 
 */
async function fetchPickupsFromServer(){
    try {
        let res = await fetch('http://localhost:8000/api/pickups/', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',
            cache: 'default',
        });
        if (!res.ok) throw new Error("erroraccio");
        else {
            return await res.json();
        }
    } catch(error) {
        console.log("couldnt fetch data");
    }
}

/** Riprisitna le dimensioni del modale quando viene chiuso
 * 
 */
$(document).on('hidden.bs.modal','#multiUseModal', function () {
    $('.modal-dialog').removeClass("modal-lg");
})


/** Azioni da eseguire quando si preme il tasto conferma per il checkbox
 * 
 */
 $(document).on('click','.confirm-checkbox-car',(e) => {
    // autorizza utente
    verifyAction();

    // mostra il pulsante "applica modifiche" solo se si è fatta una modifica 
    if (sessionStorage.getItem('hasMadeChanges') !== 1) { 
        sessionStorage.setItem('hasMadeChanges', 1);
        $("#apply-modifications").removeClass('hidden');
    }

    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 

    // cambia i valori della UI
    $("#car-bool-value-electric").text($('#isElectric').is(":checked"))
    $("#car-bool-value-automatic").text($('#hasAutomaticTransmission').is(":checked"))
    $("#car-bool-value-doors").text($('#hasThreeDoors').is(":checked"))


    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides confirm button
    }
);

/** Conferma la modifica dei dati per la data e la disponibilità
 * 
 * 
 */
$(document).on('click','.confirm-avail-car',(e) => {
    // autorizza utente
    verifyAction();

    // mostra il pulsante "applica modifiche" solo se si è fatta una modifica 
    if (sessionStorage.getItem('hasMadeChanges') !== 1) { 
        sessionStorage.setItem('hasMadeChanges', 1);
        $("#apply-modifications").removeClass('hidden');
    }

    // roba per codice UI
    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 

    // cambia i valori della UI 
    try {
        if ($("#notAvail").is(":checked")){

            // mostra i campi delle date in modo corretto
            let from_date = new Date($('#fromDate').val());
            var year = from_date.getUTCFullYear();
            if (year < 1970) from_date.setFullYear(1969);
            let date_string = from_date.toISOString();
            date_string = date_string.split('T')[0];
            $("#car-date-from").html(date_string);
            $("#car-unavail-date").addClass('text-danger');
            $("#car-unavail-date").removeClass('text-success');
            $("#avail").html("Non disponibile dal &nbsp;");

            let to_date_text = $('#toDate').val();
            if (to_date_text != "" && to_date_text != null) {
                $('#to-text').removeClass('hidden');
                let to_date = new Date(to_date_text);
                var year = to_date.getUTCFullYear();
                if (year < 1970) to_date.setFullYear(1969);
                date_string = to_date.toISOString();
                date_string = date_string.split('T')[0];
                $("#car-date-to").html(date_string);
            } else {
                $('#to-text').addClass('hidden');
                $("#car-date-to").html("");
            }
        } else {
            $("#car-unavail-date").addClass('text-success');
            $("#car-unavail-date").removeClass('text-danger');
            $("#avail").html("Disponibile nel nostro magazzino");
            $("#car-date-from").html("");
            $('#to-text').addClass('hidden');
            $("#car-date-to").html("");
        }
    } catch (e) {
        alert("date error");
    }

    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides confirm button
    }
);



/** Azioni da eseguire quando si preme il tasto conferma per il luogo di ritiro
 * 
 */
 $(document).on('click','.confirm-pickup-car',(e) => {
    // autorizza utente
    verifyAction();

    // mostra il pulsante "applica modifiche" solo se si è fatta una modifica 
    if (sessionStorage.getItem('hasMadeChanges') !== 1) { 
        sessionStorage.setItem('hasMadeChanges', 1);
        $("#apply-modifications").removeClass('hidden');
    }

    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 

    // cambia i valori della UI
    $("#car-pickup-value").text($('#pickupPlace option:selected').text())
    $("#car-pickup-value").data("pickup_id", $('#pickupPlace').val());

    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides conferma button
    }
);

/** Azioni da eseguire quando si preme il tasto modifica in caso di input testuali
 * 
 */
 $(document).on('click','.modify-car-pickup-btn',(e) => {
    // autorizza utente
    verifyAction();
    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let confirm_button = $(e.currentTarget).siblings(".confirm"); 

    // immetti il valore iniziale nel form
    $("#pickupPlace").val($("#car-pickup-value").data("pickup_id"))

    // nascondi il bottone, mostra gli altri
    // mostra anche il form di input per la modifica
    confirm_button.removeClass("hidden");
    confirm_button.focus();
    input_form.removeClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides modify button
    }
);

/** Azioni da eseguire quando si preme il tasto modifica in caso di input testuali
 * 
 */
 $(document).on('click','.confirm-car-title-btn',(e) => {
    // autorizza utente
    verifyAction();
    // mostra il pulsante "applica modifiche" solo se si è fatta una modifica 
    if (sessionStorage.getItem('hasMadeChanges') !== 1) { 
        sessionStorage.setItem('hasMadeChanges', 1);
        $("#apply-modifications").removeClass('hidden');
    }

    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 

    // immetti il valore iniziale nel form
    $("#car-title-value").text($("#autoBrand").val() + ' ' + $("#autoModel").val());    
    
    // nascondi il bottone, mostra gli altri
    // mostra anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides confirm button
    }
);
/** Renderizza le entry all'avvio della pagina.
 */
$(document).ready(function(){
    updateDisplayedEntries(); 
});

/** Evidenzia l'elemento della sidebar selezionato.
 *  Chiamato dentro load_ui_essentials.js
 */
 function highlightSidebarEntry(){
    $("#sidebar-cars").addClass("selected");
}


/**  Crea il bottone di aggiunta in base al contesto della pagina (in questo caso auto)
 *
 */
function loadAddButton(){
    $('#add-button').html('<i class="fas fa-plus"></i>&nbsp; ' + "Aggiungi auto");
}

/** Carica i modali per l'aggiunta delle auto
 */
$(document).ready(function () { // jquery delegation
    verifyAction();

    $(document).on('click','#add-button', function () { // jquery delegation
        // mostra i pickup nel select relativo
        (async () => { 
            let pickups = await fetchPickupsFromServer();
            // loading form html
            $('.modal-content').load("components/cars/carsform.html", () => {
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
        $('.modal-content').load("components/cars/modifycars.html", () => {
            
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
                        $('#car-rent-date').removeAttr('hidden');
                        $("#car-date-from").text(val.unavaiable.from);
                        $("#car-date-to").val(val.unavaiable.to);
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
        basePrice : _price
    };

    console.log(JSON.stringify(payload));
    
    sendPayload(payload, 'cars/', user_token, 'POST');
    fetchDataFromServer('cars/');
}

/** Mostra il badge di disponibilità
 * 
 */
function showAvaiabilityBadge(val){
    if (val == null || Date.now() < val.from){
        return '<span class="badge rounded-pill bg-success">In locazione</span>';
    } else {
        if (val.to < new Date(2100, 11, 17))
            return '<span class="badge rounded-pill bg-danger">Prenotato</span>';
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
        '<div tabindex="0" class="entry" data-entryid="' + val._id + '">' +
        '<span class="sr-only"> Entri di ' + val.model + '. Contiene: </span>' + 
            '<div class="entry-image"><img src="' + image + '" alt=""></div>' + 
            '<div class="entry-body">' +
                '<h5 class="entry-title">' + val.model + '&nbsp; ' + showAvaiabilityBadge(val.unavaiable) +
                '</h5>' + 
                '<p class="entry-text">Condizioni: ' + val.condition + '</p>' + 
                '<p class="entry-text id-text">id: ' + val._id + '</p>' + 
                '<span class="sr-only"> Puoi scegliere se vedere maggiori info, o rimuovere la entry. </span>' + 
                '<a href="#" class="btn btn-primary details"><i class="fas fa-info-circle"></i>&nbsp; Più dettagli</a>' + '\n' +
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
    $("#elements").load("components/loading-animation.html");
    return fetchDataFromServer('cars/');
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
    sendPayload("", 'cars/' + id + '/', user_token, 'DELETE');
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
        basePrice : _price
    };
    alert(JSON.stringify(payload));
    sendPayload(payload, 'cars/' + id, user_token, 'PUT');
    fetchDataFromServer('cars/');
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
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 

    // cambia i valori della UI
    $("#car-bool-value-electric").text($('#isElectric').is(":checked"))
    $("#car-bool-value-automatic").text($('#hasAutomaticTransmission').is(":checked"))
    $("#car-bool-value-doors").text($('#hasThreeDoors').is(":checked"))


    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    input_form.addClass("hidden"); // shows input forms and buttons
    ignore_button.addClass("hidden");
    $(e.currentTarget).addClass("hidden"); // hides ignore button
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
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 

    // cambia i valori della UI
    $("#car-pickup-value").text($('#pickupPlace option:selected').text())
    $("#car-pickup-value").data("pickup_id", $('#pickupPlace').val());

    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    input_form.addClass("hidden"); // shows input forms and buttons
    ignore_button.addClass("hidden");
    $(e.currentTarget).addClass("hidden"); // hides ignore button
    }
);

/** Azioni da eseguire quando si preme il tasto modifica in caso di input testuali
 * 
 */
 $(document).on('click','.modify-car-pickup-btn',(e) => {
    // autorizza utente
    verifyAction();
    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 
    let confirm_button = $(e.currentTarget).siblings(".confirm"); 

    // immetti il valore iniziale nel form
    $("#pickupPlace").val($("#car-pickup-value").data("pickup_id"))

    // nascondi il bottone, mostra gli altri
    // mostra anche il form di input per la modifica
    ignore_button.removeClass("hidden");
    confirm_button.removeClass("hidden");
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
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 

    // immetti il valore iniziale nel form
    $("#car-title-value").text($("#autoBrand").val() + ' ' + $("#autoModel").val());    
    
    // nascondi il bottone, mostra gli altri
    // mostra anche il form di input per la modifica
    modify_button.removeClass("hidden");
    input_form.addClass("hidden"); // shows input forms and buttons
    ignore_button.addClass("hidden");
    $(e.currentTarget).addClass("hidden"); // hides ignore button
    }
);
/** Renderizza le entry all'avvio della pagina.
 */
$(document).ready(function(){
    updateDisplayedEntries(); 
});

/** Evidenzia l'elemento della sidebar selezionato.
 *  Chiamato dentro load_ui_essentials.js
 */
function highlightSidebarEntry(){
    $("#sidebar-kits").addClass("selected");
}


/**  Crea il bottone di aggiunta in base al contesto della pagina (in questo caso pickups)
 *
 */
function loadAddButton(){
    $('#add-button').html('<i class="fas fa-plus"></i>&nbsp; ' + "Aggiungi kit");
}

/** Carica la modale per l'aggiunta dei pickups
 */
$(document).ready(function () { // jquery delegation
    verifyAction();

    $(document).on('click','#add-button', function () { // jquery delegation

        // loading form html
        $('.modal-content').load("components/pickups/pickupform.html");

        // opening menu
        $('#multiUseModal').modal('toggle');
    });
});


/** Carica la ui del modale e i dati prendendoli dalla sessione corrente.
 *  Dopodiché, lo apre.
 *  Versione del pickup.
 */
function loadDetailsById(id){ 
    $('.modal-content').load("components/pickups/modifypickup.html", () => {
        let data = window.sessionStorage.getItem("latest_fetch"); 
        
        $.each(JSON.parse(data), function(key, val) {
            if (val._id === id.toString()){
                $("#pickup-title-value").text(val.point);
                $("#pickup-type-value").text(val.type);
            }
        })
    });
}


/** Formula i dati di un nuovo pickup e li invia al server
 *  Versione del pickup.
 */
function createPickup(){
    var data = $('#pickupName').val();
    var type = document.querySelector('input[name="selezioneTipoPickup"]:checked').value;

    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    
    var payload = {point : data, type : type};
    sendPayload(payload, 'kits/', user_token, 'POST');
    fetchDataFromServer('kits/');
}



/** Mostra/formula le entry nella pagina.
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
        '<span class="sr-only"> Entri di ' + val.point + '. Contiene: </span>' + 
            '<div class="entry-image"><img src="' + image + '" alt=""></div>' + 
                '<div class="entry-body">' +
                '<h5 class="entry-title">' + val.point + '</h5>' + 
                '<p class="entry-text">' + val.type + '</p>' + 
                '<span class="sr-only"> Puoi scegliere se vedere maggiori info, o rimuovere la entry. </span>' + 
                '<a href="#" class="btn btn-primary details"><i class="fas fa-info-circle"></i>&nbsp; Più dettagli</a>' + '\n' +
                '<a href="#" class="btn btn-danger removeAlert"><i class="fas fa-trash-alt"></i>&nbsp; Rimuovi</a>' +
            '</div>' +
        '</div>';
        $("#elements").append(element);
    });
}

/** Aggiorna le entries dei pickups sullo schermo
 * 
 */
function updateDisplayedEntries(){
    // mette la schermata di caricamento
    $("#elements").load("components/loading-animation.html");
    return fetchDataFromServer('pickups/');
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
    sendPayload("", 'pickups/' + id + '/', user_token, 'DELETE');
    $('#multiUseModal').modal('toggle');
    }
);

/** Modifica un pickup.
 * 
 */
$(document).on('click','#apply-modifications', (e) => {
    // autorizza utente
    verifyAction();

    // prendi le informazioni necessarie
    let user_token = window.localStorage.getItem('token');
    let id = $('#multiUseModal').data('id');
    let data = $("#pickup-title-value").text();
    let type = $("#pickup-type-value").text();

    // manda i dati con una PUT al backend
    let payload = {point : data, type : type};
    sendPayload(payload, 'pickups/' + id, user_token, 'PUT');
    fetchDataFromServer('pickups/');
    }
);
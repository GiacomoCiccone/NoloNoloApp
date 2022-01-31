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


/** Crea il bottone di aggiunta in base al contesto della pagina (in questo caso kits)
 *  Inoltre, cambia il placeholder della ricerca.
 */
function loadAddButton(){
    $('#add-button').html('<i class="fas fa-plus"></i>&nbsp; ' + "Aggiungi kit");
    $("#search-input").attr('placeholder', 'Cerca il nome del kit...');
}



/** Carica la modale per l'aggiunta dei kitss
 */
$(document).ready(function () { // jquery delegation
    verifyAction();
    
    $(document).on('click','#add-button', function () { // jquery delegation

        // loading form html
        $('.modal-content').load("components/kits/kitsform.html");

        // opening menu
        $('#multiUseModal').modal('toggle');
    });
});


/** Carica la ui del modale e i dati prendendoli dalla sessione corrente.
 *  Dopodiché, lo apre.
 *  Versione del kits.
 */
function loadDetailsById(id){ 
    $('.modal-content').load("components/kits/modifykits.html", () => {
        let data = window.sessionStorage.getItem("latest_fetch"); 
        console.log(data)
        $.each(JSON.parse(data), function(key, val) {
            if (val._id === id.toString()){
                
                // nome
                $("#kit-title-value").text(val.name);
                $("#kitName").val(val.name);

                // prezzo
                $("#kit-price-value").text(val.price);
                $("#kitPrice").val(val.price);

                // immagine
                $("#kit-image-value").text(val.image);
                $("#kitImage").val(val.image);
            }
        })
    });
}


/** Formula i dati di un nuovo kit e li invia al server
 *  Versione del kit.
 */
function createKit(){
    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}

    let name_ = $("#kitName").val();

    // prezzo
    let price_ = $("#kitPrice").val();

    // immagine
    let image_ = $("#kitImage").val();

    // manda i dati con una PUT al backend
    let payload = {name : name_, image : image_, price : price_};
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
        '<span class="sr-only"> Entri di ' + val.name + '. Contiene: </span>' + 
            '<div class="entry-image"><img src="' + image + '" alt=""></div>' + 
                '<div class="entry-body">' +
                '<h5 class="entry-title">' + val.name + '</h5>' + 
                '<p class="entry-text">Costo al giorno:&nbsp;' + val.price + '€</p>' + 
                '<span class="sr-only"> Puoi scegliere se vedere maggiori info, o rimuovere la entry. </span>' + 
                '<a href="#" class="btn btn-primary details"><i class="fas fa-info-circle"></i>&nbsp; Più dettagli</a>' +
                '<a href="#" class="btn btn-danger removeAlert"><i class="fas fa-trash-alt"></i>&nbsp; Rimuovi</a>' +
            '</div>' +
        '</div>';
        $("#elements").append(element);
    });
}

/** Aggiorna le entries dei kits sullo schermo
 * 
 */
function updateDisplayedEntries(){
    // mette la schermata di caricamento
    $("#elements").load("components/loading-animation.html", () => {
        return fetchDataFromServer('kits/');
    });
}

/** Rimuove un kit.
 *  Viene applicato quando si preme "si" al modale di rimozione.
 */
$(document).on('click','.remove',(e) => {
    // autorizza utente
    verifyAction();
    var user_token = window.localStorage.getItem('token');
    var id = $('#multiUseModal').data('id');

    // elimina e chiudi la modale
    sendPayload("", 'kits/' + id + '/', user_token, 'DELETE');
    $('#multiUseModal').modal('toggle');
    }
);

/** Modifica un kit.
 * 
 */
$(document).on('click','#apply-modifications', (e) => {
    // autorizza utente
    verifyAction();

    // prendi le informazioni necessarie
    let user_token = window.localStorage.getItem('token');
    let id = $('#multiUseModal').data('id');

    // prendi le informazioni necessarie
    let name_ = $("#kitName").val();

    // prezzo
    let price_ = $("#kitPrice").val();

    // immagine
    let image_ = $("#kitImage").val();

    // manda i dati con una PUT al backend
    let payload = {name : name_, image : image_, price : price_};
    sendPayload(payload, 'kits/' + id, user_token, 'PUT');
    fetchDataFromServer('kits/');
    }
);
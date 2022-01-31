/** Renderizza le entry all'avvio della pagina.
 */
$(document).ready(function(){
    updateDisplayedEntries(); 
});

/** Evidenzia l'elemento della sidebar selezionato.
 *  Chiamato dentro load_ui_essentials.js
 */
 function highlightSidebarEntry(){
    $("#sidebar-users").addClass("selected");
}


/**  Crea il bottone di aggiunta in base al contesto della pagina (in questo caso auto)
 *
 */
function loadAddButton(){
    $('#add-button').html('<i class="fas fa-plus"></i>&nbsp; ' + "Aggiungi utente");
    $('#add-button').attr('hidden', 'hidden');
    $("#search-input").attr('placeholder', 'Cerca lo username di un utente...');
    // $('#search-bar').load('components/users/userssearchbar.html');
}

/** Carica i modali per l'aggiunta degli utenti
 */
$(document).ready(function () { // jquery delegation
    verifyAction();

    $(document).on('click','#add-button', function () { // jquery delegation
        // loading form html
        $('.modal-dialog').addClass('modal-lg');
        $('.modal-content').load("components/users/usersform.html", () => {

        // opening menu
        $('#multiUseModal').modal('toggle');
        })
    });
});


/** Carica la ui del modale e i dati prendendoli dalla sessione corrente.
 *  Dopodiché, lo apre.
 *  Versione degli utenti.
 */
function loadDetailsById(id){ 
    $('.modal-dialog').addClass('modal-lg');
    
    $('.modal-content').load("components/users/modifyusers.html", () => {
        // prendi la variabile di stato dalla sessione
        let data = window.sessionStorage.getItem("latest_fetch"); 
        
        // riempi ogni campo del menu della descrizioni
        $.each(JSON.parse(data), function(key, val) {
            if (val._id === id.toString()){
                // Nome e congnome utente
                $("#name-value").text(val.first_name + ' ' + val.last_name);
                $("#name_").val(val.first_name);
                $("#surname_").val(val.last_name);
                
                // Username
                $("#username-value").text(val.username);
                $("#username").val(val.username);
                
                // Email
                $("#email-value").text(val.email);
                $("#userEmail").val(val.email);

                // Ruolo
                $("#role-value").text(val.role);
                $("input[name=userRole][value=" + val.role + "]").attr('checked', 'checked');
                
                // Sesso
                $("#sex-value").text(val.gender);
                $("input[name=userSex][value=" + val.gender + "]").attr('checked', 'checked');
                
                // Address
                $("#address-value").text(val.address.via +', ' + val.address.city + ', ' + val.address.postal_code);
                $("#addressStreet").val(val.address.via);
                $("#addressCity").val(val.address.city);
                $("#addressZip").val(val.address.postal_code);
                
                // Birthdate
                let date_string = val.birth.split('T')[0];
                $("#birthdate-value").text(date_string);
                $("#birthDate").val(date_string);

                // Booleans
                $("#user-bool-value-rompiscatole").text((val.comments.includes('RO')))
                $("#isRompiscatole").attr('checked', (val.comments.includes('RO')));
                $("#user-bool-value-ritardatario").text((val.comments.includes('RI')))
                $("#isRitardatario").attr('checked', (val.comments.includes('RI')))
                $("#user-bool-value-guastatore").text((val.comments.includes('GU')))
                $("#isGuastatore").attr('checked', (val.comments.includes('GU')));

                // Id 
                $("#user-id-value").text(val._id);

                // data creazione e ultima modifica
                $('#creation-date').text(val.createdAt);
                $('#change-date').text(val.updatedAt);
            }
        })
    });
}



/** Mostra i dati relativi agli utenti nella pagina.
 * 
 */
function displayData(data){
    $("#elements").html("");
    $.each(data, function(key, val) { 
        var image;
        if (val.image == null) image = 'https://cdn-icons-png.flaticon.com/512/149/149071.png' ;
        else image = val.image;
        var element =             
        '<div tabindex="0" class="entry" data-entryid="' + val._id + '">' +
        '<span class="sr-only"> Entri di ' + val.username + '. Contiene: </span>' + 
            '<div class="entry-image"><img src="' + image + '" alt=""></div>' + 
            '<div class="entry-body">' +
                '<h5 class="entry-title">' + val.username +
                '</h5>' + 
                '<p class="entry-text">Ruolo: ' + val.role + '</p>' + 
                '<p class="entry-text id-text">id: ' + val._id + '</p>' + 
                '<span class="sr-only"> Puoi scegliere se vedere maggiori info, o rimuovere la entry. </span>' + 
                '<a href="#" class="btn btn-primary details"><i class="fas fa-info-circle"></i>&nbsp; Più dettagli</a>' +
                '<a href="#" class="btn btn-dark send-mail"><i class="fas fa-envelope"></i>&nbsp; Invia mail</a>' +
                '<a href="#" class="btn btn-danger removeAlert"><i class="fas fa-trash-alt"></i>&nbsp; Rimuovi account</a>' +
            '</div>' +
        '</div>';
        $("#elements").append(element);
    });
}

/** Aggiorna le entries degli utenti sullo schermo
 * 
 */
function updateDisplayedEntries(){
    // mette la schermata di caricamento
    var user_token = window.localStorage.getItem('token');
    $("#elements").load("components/loading-animation.html", () => {
        return fetchProtectedDataFromServer('users/', user_token);
    });
}

/** Rimuove un utente.
 *  Viene applicato quando si preme "si" al modale di rimozione.
 */
$(document).on('click','.remove',(e) => {
    // autorizza utente
    verifyAction();
    var user_token = window.localStorage.getItem('token');
    var id = $('#multiUseModal').data('id');

    // elimina e chiudi la modale
    sendPayload("", 'users/' + id + '/', user_token, 'DELETE');
    $('#multiUseModal').modal('toggle');
    }
);


/** Modifica le informazioni di un utente
 * 
 */
$(document).on('click','#apply-modifications', (e) => {
    // autorizza utente
    verifyAction();

    // prendi i campi che servono
    let name_ = $("#name_").val();
    let surname_ = $("#surname_").val();
    let username_ = $("#username").val();
    let email_ = $("#userEmail").val();
    let role_ = document.querySelector('input[name="userRole"]:checked').value;
    let gender_ = document.querySelector('input[name="userSex"]:checked').value;
    let birth_ = new Date($("#birthDate").val());    
    let via_ = $("#addressStreet").val();
    let city_ = $("#addressCity").val();
    let postal_code_ = $("#addressZip").val();

    let address_ = {
        via : via_,
        city : city_,
        postal_code : postal_code_
    }

    let elements = [] 
    if (document.getElementById('isRitardatario').checked) elements.push('RI');
    if (document.getElementById('isRompiscatole').checked) elements.push('RO');
    if (document.getElementById('isGuastatore').checked) elements.push('GU');


    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    
    let payload = {
        first_name : name_, 
        last_name : surname_,
        username : username_,
        email : email_,
        birth : birth_,
        address : address_,
        role : role_,
        gender : gender_,
        comments : elements
    };

    // id per specificare a quale user fare la modifica
    let id = $('#multiUseModal').data('id');

    console.log(JSON.stringify(payload));
    
    sendPayload(payload, 'users/' + id, user_token, 'PUT');
    }
);



/** Riprisitna le dimensioni del modale quando viene chiuso
 * 
 */
$(document).on('hidden.bs.modal','#multiUseModal', function () {
    $('.modal-dialog').removeClass("modal-lg");
})


/** Azioni da eseguire quando si preme il tasto conferma per il checkbox
 * 
 */
 $(document).on('click','.confirm-checkbox-user',(e) => {
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
    $("#user-bool-value-rompiscatole").text($('#isRompiscatole').is(":checked"))
    $("#user-bool-value-ritardatario").text($('#isRitardatario').is(":checked"))
    $("#user-bool-value-guastatore").text($('#isGuastatore').is(":checked"))


    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides confirm button
    }
);

/** Azioni da eseguire quando si preme il tasto conferma per il checkbox
 * 
 */
 $(document).on('click','.send-mail',(e) => {
    // autorizza utente
    verifyAction();

    var id = $(e.currentTarget).closest("[data-entryid]").data("entryid"); //get item-id, embeeded into html element

    $('.modal-content').load("components/users/sendmail.html", () => {
        $('#multiUseModal').data('id', id).modal('toggle'); // only way to pass id to modal...
    });
    }
);

/** Azioni da eseguire quando si preme il tasto conferma per il checkbox
 * 
 */
 $(document).on('click','#sendMailConfirm',(e) => {
    // autorizza utente
    verifyAction();

    let id = $('#multiUseModal').data('id') //get item-id, embeeded into html element
    
    let email_content = $('#mailContent').val();
    let email_subject = $('#mailSubject').val();
    var user_token = window.localStorage.getItem('token');
    let payload = {
        subject : email_subject,
        text : email_content
    }

    sendPayload(payload, 'users/contacts/' + id, user_token, 'POST');

    }
);


/** Azioni da eseguire quando si preme il tasto modifica in caso del nome e cognome
 * 
 */
 $(document).on('click','.confirm-user-title-btn',(e) => {
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
    $("#name-value").html($("#name_").val() + ' ' + $("#surname_").val());    
    
    // nascondi il bottone, mostra gli altri
    // mostra anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides confirm button
    }
);

/** Azioni da eseguire quando si preme il tasto modifica in caso dell'indirizzo
 * 
 */
 $(document).on('click','.confirm-address-btn',(e) => {
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
    $("#address-value").text($("#addressStreet").val() +', ' + $("#addressCity").val() + ', ' + $("#addressZip").val() );
 
    
    // nascondi il bottone, mostra gli altri
    // mostra anche il form di input per la modifica
    modify_button.removeClass("hidden");
    modify_button.focus(); 
    input_form.addClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides confirm button
    }
);
/** Contiene il codice per il menu a tendina quando si preme il pulsante "più dettagli".
 * 
 */


/** Azioni da eseguire quando si preme il tasto "più dettagli".
 *  Essenzialmente viene caricata la pagina corretta e vengono modificati
 *  i dati da mostrare nella tendina.
 */
$(document).on('click','.details', function () { // jquery delegation
    var clickid = $(this.closest("[data-entryid]")).data("entryid");
    loadDetailsById(clickid);
    $('#multiUseModal').data('id', clickid).modal('toggle'); // only way to pass id to modal...
});

/** Azioni da eseguire quando si preme il tasto modifica.
 * 
 */
$(document).on('click','.modify-basic',(e) => {
    // autorizza utente
    verifyAction();
    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 
    let confirm_button = $(e.currentTarget).siblings(".confirm"); 
    
    // nascondi il bottone, mostra gli altri
    // mostra anche l'input di modifica
    ignore_button.removeClass("hidden");
    confirm_button.removeClass("hidden");
    input_form.removeClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides modify button
    }
);

/** Azioni da eseguire quando si preme il tasto modifica in caso di input testuali
 * 
 */
 $(document).on('click','.modify-input-text-btn',(e) => {
    // autorizza utente
    verifyAction();
    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 
    let confirm_button = $(e.currentTarget).siblings(".confirm"); 

    let prev_value = $(e.currentTarget).closest('.value-container').find('.modify-text').text();

    // immetti il valore iniziale nel form
    $(e.currentTarget).closest('.modify-container').find('.modify-input-text').val(prev_value);

    // nascondi il bottone, mostra gli altri
    // mostra anche il form di input per la modifica
    ignore_button.removeClass("hidden");
    confirm_button.removeClass("hidden");
    input_form.removeClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides modify button
    }
);


/** Azioni da eseguire quando si preme il tasto ignora.
 * 
 */
$(document).on('click','.ignore',(e) => {
    // autorizza utente
    verifyAction();
    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 
    let confirm_button = $(e.currentTarget).siblings(".confirm"); 

    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    input_form.addClass("hidden"); // shows input forms and buttons
    confirm_button.addClass("hidden");
    $(e.currentTarget).addClass("hidden"); // hides ignore button
    }
);

/** Azioni da eseguire quando si preme il tasto conferma per un input testuale
 * 
 */
$(document).on('click','.confirm-basic',(e) => {
    // autorizza utente
    verifyAction();

    // mostra il pulsante "applica modifiche" solo se si è fatta una modifica 
    if (sessionStorage.getItem('hasMadeChanges') !== 1) { 
        sessionStorage.setItem('hasMadeChanges', 1);
        $("#apply-modifications").removeClass('hidden');
    }

    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let input_text = $(e.currentTarget).closest('.modify-container').find('.modify-input-text').val();
    let modify_button = $(e.currentTarget).siblings(".modify"); 
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 

    // modify value here
    $(e.currentTarget).closest('.value-container').find('.modify-text').text(input_text);

    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    input_form.addClass("hidden"); // shows input forms and buttons
    ignore_button.addClass("hidden");
    $(e.currentTarget).addClass("hidden"); // hides ignore button
    }
);


/** Azioni da eseguire quando si preme il tasto conferma per un input radio
 * 
 */
 $(document).on('click','.confirm-radio',(e) => {
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

    // modifica i dati nel modale
    var radioValue = $("input[type='radio']:checked").val();
    $(e.currentTarget).closest('.value-container').find('.modify-text').text(radioValue);

    // nascondi bottoni, mostra altri
    // nasconde anche il form di input per la modifica
    modify_button.removeClass("hidden");
    input_form.addClass("hidden"); // shows input forms and buttons
    ignore_button.addClass("hidden");
    $(e.currentTarget).addClass("hidden"); // hides ignore button
    }
);

/** Mostra la modale per la conferma della rimozione di una entry
 * 
 */
$(document).on('click','.removeAlert', function (e) {
    verifyAction();

    var id = $(this.closest("[data-entryid]")).data("entryid"); //get item-id, embeeded into html element
    var name = $(this.parentElement.querySelector('.entry-title')).text(); // name of entry, used only for ui

    $('.modal-content').load("components/warning_modal.html", () => {
        $('.modal-body').html( "<p>Sei sicuro di voler eliminare " + name + "?</p>")}
    );
    
    // open modal and pass id
    $('#multiUseModal').data('id', id).modal('toggle'); // only way to pass id to modal...
});
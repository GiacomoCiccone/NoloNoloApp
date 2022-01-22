//change name of this script to MODIFY-MENU

// open modify menu
$(document).on('click','.details', function () { // jquery delegation
    var clickid = $(this.closest("[data-entryid]")).data("entryid");

    $.getJSON('sample_data/cars_store.json', function(data) {
        $.each(data, function(key, val) {
            if (val.id === clickid.toString()){
                $("#ex-title").text(val.car.model);
                $("#ex-data").text("id: " + val.id);
            }
        })
    });
    $('.modal-content').load("components/modifypickup.html");
    $('#multiUseModal').modal('toggle');
});

// handler of modification...
// $(document).on('click','.removeAlert', function (e) {
//     verifyAction();

//     var id = $(this.closest("[data-entryid]")).data("entryid"); //get item-id, embeeded into html element
//     var name = $(this.parentElement.querySelector('.entry-title')).text(); // name of entry, used only for ui

//     $('.modal-content').load("components/warning_modal.html", () => {
//         $('.modal-body').html( "<p>Sei sicuro di voler eliminare " + name + "?</p>")}
//     );
    
//     // open modal and pass id
//     $('#multiUseModal').data('id', id).modal('toggle'); // only way to pass id to modal...
// });

// $(document).on('click','.remove',(e) => {
//     verifyAction();
//     var user_token = window.localStorage.getItem('token');
//     var id = $('#multiUseModal').data('id');
//     deleteElement("",'pickups/' + id + '/', user_token);
//     $('#multiUseModal').modal('toggle');
//     }
// );


$(document).on('click','.modify',(e) => {
    verifyAction();
    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 
    let confirm_button = $(e.currentTarget).siblings(".confirm"); 
    
    ignore_button.removeClass("hidden");
    confirm_button.removeClass("hidden");
    input_form.removeClass("hidden"); // shows input forms and buttons
    $(e.currentTarget).addClass("hidden"); // hides modify button
    }
);

$(document).on('click','.ignore',(e) => {
    verifyAction();
    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 
    let confirm_button = $(e.currentTarget).siblings(".confirm"); 

    modify_button.removeClass("hidden");
    input_form.addClass("hidden"); // shows input forms and buttons
    confirm_button.addClass("hidden");
    $(e.currentTarget).addClass("hidden"); // hides ignore button
    }
);


$(document).on('click','.confirm',(e) => {
    if (sessionStorage.getItem('hasMadeChanges') !== 1) { 
        sessionStorage.setItem('hasMadeChanges', 1);
        let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input')
        $("#apply-pickup-modifications").removeClass('hidden');
    }

    let input_form = $(e.currentTarget).closest('.modify-container').find('.modify-input');
    let modify_button = $(e.currentTarget).siblings(".modify"); 
    let ignore_button = $(e.currentTarget).siblings(".ignore"); 

    // modify value here

    modify_button.removeClass("hidden");
    input_form.addClass("hidden"); // shows input forms and buttons
    ignore_button.addClass("hidden");
    $(e.currentTarget).addClass("hidden"); // hides ignore button

    // todo: aggiungere pulsante di conferma
    // save data to modal
    }
);
$(document).ready(function () { // jquery delegation
    verifyAction();
    var page_context = $('#list-wrapper').data("type");
    console.log("context: " + page_context);

    $(document).on('click','#add-button', function () { // jquery delegation

        // loading form html
        console.log("page_context: " + page_context);
        if (page_context === "pickups")
            $('.modal-content').load("components/pickupform.html");
        else if (page_context === "pickups")
            $('#add-fields').load("components/userform.html");

        // open menu
        $('#multiUseModal').modal('toggle');
    });
});

// entry removal handler
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

$(document).on('click','.remove',(e) => {
    verifyAction();
    var user_token = window.localStorage.getItem('token');
    var id = $('#multiUseModal').data('id');
    deleteElement("",'pickups/' + id + '/', user_token);
    $('#multiUseModal').modal('toggle');
    }
);
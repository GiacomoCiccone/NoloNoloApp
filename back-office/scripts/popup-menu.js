$(document).ready(function () { // jquery delegation
    var page_context = $('#list-wrapper').data("type");
    console.log("context: " + page_context);

    ///TODO: al posto di dismiss, devo aggiungere un pulsante tipo clicca via...
    $('#dismiss, .overlay').on('click', function () {
        // hide menu
        $('#add-menu').removeClass('active');
        // hide overlay
        $('.overlay').removeClass('active');
    });

    $(document).on('click','#add-button', function () { // jquery delegation

        // loading form html
        console.log("page_context: " + page_context);
        if (page_context === "pickups")
            $('#add-fields').load("components/pickupform.html");
        else if (page_context === "pickups")
            $('#add-fields').load("components/userform.html");

        // open menu
        $('#add-menu').addClass('active');
        // fade in the overlay
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
    });
});

function sumbitDataToServer(){

}
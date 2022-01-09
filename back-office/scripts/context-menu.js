$(document).ready(function () {
    $("#context-menu").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        // hide menu
        $('#context-menu').removeClass('active');
        // hide overlay
        $('.overlay').removeClass('active');
    });

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
        // open menu
        $('#context-menu').addClass('active');
        // fade in the overlay
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
    });
});
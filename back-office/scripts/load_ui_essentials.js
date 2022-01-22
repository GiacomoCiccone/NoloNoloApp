$(document).ready(() => {
    let page;
    $('#sidebar').load("components/sidebar.html", () => {
        // codice per l'highlight dell'entry della sidebar
    });
    $('#content-header').load("components/header.html", () => {
        if (window.localStorage.getItem('token') != null){
            let user_info = window.localStorage.getItem('user_info')
            var parsedData = JSON.parse(user_info);
            $('#login-text').html('<i class="fas fa-user"></i>&nbsp; Ciao, ' + parsedData.first_name + '!&nbsp; ');
            $(document.body).css('visibility', 'visible');
        }
        page = $('#list-wrapper').data("type");
        var context;
        console.log("page: " + page);
        if (page === "users") context = "Agg. utenti";
        else if (page === "pickups") context = "Agg. luoghi di ritiro";
        $('#add-button').html('<i class="fas fa-plus"></i>&nbsp; ' + context);
    });
    console.log("test: " + page);
});

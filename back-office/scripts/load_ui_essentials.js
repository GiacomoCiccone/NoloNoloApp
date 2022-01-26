/** Questo codice è riservato al caricamento delle componenti UI
 *  generiche del Backoffice.
 * 
 */

$(document).ready(() => {
    let page;
    $('#sidebar').load("components/sidebar.html", () => {
        // codice per l'highlight dell'entry della sidebar
    });

    $('#content-header').load("components/header.html", () => {
        
        // caricamento dei dati dell'utente loggato
        if (window.localStorage.getItem('token') != null){
            let user_info = window.localStorage.getItem('user_info')
            var parsedData = JSON.parse(user_info);
            $('#login-text').html('<i class="fas fa-user"></i>&nbsp; Ciao, ' + parsedData.first_name + '!&nbsp; ');
            $(document.body).css('visibility', 'visible');
        }
        
        $(".modal-content").load("components/loading-animation.html");
        // questo codice sarà rimpiazzato con una versione dipendente dalla pagina
        page = $('#list-wrapper').data("type");
        var context;
        console.log("page: " + page);

        if (page === "users") context = "Agg. utenti";
        else if (page === "pickups") context = "Agg. luoghi di ritiro";
        $('#add-button').html('<i class="fas fa-plus"></i>&nbsp; ' + context);
    });
});

/** Riprisitna il modale quando questo viene chiuso.
 * 
 */
$(document).on('hidden.bs.modal','#multiUseModal', function () {
    $(".modal-content").load("components/loading-animation.html");
    sessionStorage.setItem('hasMadeChanges', 0);
})
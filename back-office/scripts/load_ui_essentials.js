/** Questo codice è riservato al caricamento delle componenti UI
 *  generiche del Backoffice.
 * 
 */

$(document).ready(() => {
    let page;
    $('#sidebar').load("components/sidebar.html", () => {
        // codice per l'highlight dell'entry della sidebar
        highlightSidebarEntry();
    });

    $("#elements").load("components/loading-animation.html");

    $('#content-header').load("components/header.html", () => {
        
        // caricamento dei dati dell'utente loggato
        if (window.localStorage.getItem('token') != null){
            let user_info = window.localStorage.getItem('user_info')
            var parsedData = JSON.parse(user_info);
            $('#login-text').html('<i class="fas fa-user"></i>&nbsp; Ciao, ' + parsedData.first_name + '!&nbsp; ');
            $(document.body).css('visibility', 'visible');
        }
        
        loadAddButton();
        $(".modal-content").load("components/loading-animation.html");
    });
});

/** Riprisitna il modale quando questo viene chiuso.
 * 
 */
$(document).on('hidden.bs.modal','#multiUseModal', function () {
    $(".modal-content").load("components/loading-animation.html");
    sessionStorage.setItem('hasMadeChanges', 0);
})
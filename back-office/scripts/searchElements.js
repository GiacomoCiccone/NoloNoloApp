$(document).on('click','#search-submit', function () { // jquery delegation
    search(); // l'ho messo qui così non ci sono problemi se uno volessi fare una query premento invio
});


function search(){
    var key = $('#search-input').val();
    var elems = document.querySelectorAll(".entry-title")

    for (let i = 0; i < elems.length; i++) {
        if (!(elems[i].innerText.toLowerCase().indexOf(key.toLowerCase()) >= 0)) // if the string is not contained...
            (elems[i].closest(".entry")).style.display = 'none'; //...get rekt
        else
            (elems[i].closest(".entry")).style.display = 'grid';
    }
}
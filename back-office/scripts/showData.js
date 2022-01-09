$(document).ready(function(){
    fetchDataFromServer();
});

// versione momentanea del codice di login in base a dati in json.
function fetchDataFromServer(){
    var page_context = $('#list-wrapper').data("type");

    if (page_context === "pickups"){
        const fetchdata = async () => {
            try {
                let res = await fetch('http://localhost:8000/api/pickups/', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                    mode: 'cors',
                    cache: 'default',
                });
                if (!res.ok) throw new Error("erroraccio");
                else {
                    fetchedData = await res.json();
                    displayData(fetchedData.data, page_context);
                }
            } catch(error) {
                console.log("couldnt fetch data");
            }
        }
        return fetchdata();
    } else {
        // per ora uso questa soluzione, poi la cambio asap
        $.getJSON('sample_data/cars_store.json', function(data) {
            $.each(data, function(key, val) { 
                var element =             
                '<div tabindex="0" class="entry" data-entryid="' + val.id + '">' +
                '<span class="sr-only"> Entri di ' + val.car.model + '. Contiene: </span>' + 
                    '<div class="entry-image"><img src="' + val.image + '" alt=""></div>' + 
                        '<div class="entry-body">' +
                        '<h5 class="entry-title">' + val.car.model + '</h5>' + 
                        '<p class="entry-text">' + val.car.description + '</p>' + 
                        '<span class="sr-only"> Puoi scegliere se vedere maggiori info, o rimuovere la entry. </span>' + 
                        '<a href="#" class="btn btn-primary details"><i class="fas fa-info-circle"></i>&nbsp; Più dettagli</a>' + '\n' +
                        '<a href="#" class="btn btn-danger remove"><i class="fas fa-trash-alt"></i>&nbsp; Rimuovi</a>' +
                    '</div>' +
                '</div>';
                $("#elements").append(element);
            })
        });
    }
}

function displayData(data, context){
    $("#elements").html("");
    $.each(data, function(key, val) { 
        var image;
        if (val.image == null) image = 'https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/image' ;
        else image = val.image;
        var element =             
        '<div tabindex="0" class="entry" data-entryid="' + val._id + '">' +
        '<span class="sr-only"> Entri di ' + val.point + '. Contiene: </span>' + 
            '<div class="entry-image"><img src="' + image + '" alt=""></div>' + 
                '<div class="entry-body">' +
                '<h5 class="entry-title">' + val.point + '</h5>' + 
                '<p class="entry-text">' + val.type + '</p>' + 
                '<span class="sr-only"> Puoi scegliere se vedere maggiori info, o rimuovere la entry. </span>' + 
                '<a href="#" class="btn btn-primary details"><i class="fas fa-info-circle"></i>&nbsp; Più dettagli</a>' + '\n' +
                '<a href="#" class="btn btn-danger remove"><i class="fas fa-trash-alt"></i>&nbsp; Rimuovi</a>' +
            '</div>' +
        '</div>';
        $("#elements").append(element);
    });
}




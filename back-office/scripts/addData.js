$('#add-menu').on('click','#sendPickupData', function () { // jquery delegation
    //sendPickupData(); // l'ho messo qui così non ci sono problemi se uno volessi fare una query premento invio
});

$(document).on('click','.remove', function () { // fake deletion
    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    console.log(user_token);
    var id = $(this.closest("[data-entryid]")).data("entryid");
    deleteElement("",'pickups/' + id + '/', user_token);
});


function sendPickupData(){
    var data = $('#pickupName').val();
    var type = document.querySelector('input[name="selezioneTipoPickup"]:checked').value;

    var user_token = window.localStorage.getItem('token');
    if (user_token == null) {alert("user data not found"); window.replace("./"); return false;}
    
    var payload = {point : data, type : type};
    sendPayload(payload, 'pickups/', user_token);
    fetchDataFromServer();
    $('#add-menu').removeClass('active');
    $('.overlay').removeClass('active');
}

// versione momentanea del codice di login in base a dati in json.
function sendPayload(payload, url, user){
    console.log("Bearer " + user);
    const sendData = async () => {
        try {
            let object_pickup = await fetch('http://localhost:8000/api/' + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + user
                },
                mode: 'cors',
                cache: 'default',
                body: (payload === "") ? "" : JSON.stringify(payload)
            });
            if (!object_pickup.ok) throw new Error("erroraccio");
            else {
                fetched_object = await object_pickup.json();
                console.log("action returned: " + fetched_object);
                fetchDataFromServer();
            }
        } catch(error) {
            alert("Error sending data...");
        }
    }

    return sendData();
}

function deleteElement(payload, url, user){
    console.log("Bearer " + user);
    const sendData = async () => {
        try {
            let object_pickup = await fetch('http://localhost:8000/api/' + url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + user
                },
                mode: 'cors',
                cache: 'default',
            });
            if (!object_pickup.ok) throw new Error("erroraccio");
            else {
                fetched_object = await object_pickup.json();
                console.log("action returned: " + fetched_object);
                fetchDataFromServer();
            }
        } catch(error) {
            alert("Error sending data...");
        }
    }
    return sendData();
}


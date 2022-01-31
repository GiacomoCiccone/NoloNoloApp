/** Contiene le primitive usate per comunicare col backend.
 * 
 */ 



/** Invia un payload con i dati, in base a una determinata richiesta http.
 *  Questa funzione sostituirà i 3 metodi scritti prima, prima o poi
 */
function sendPayload(payload, url, user, _method){
    console.log("Bearer " + user);

    const sendData = async () => {
        try {
            let object_pickup = await fetch('http://localhost:8000/api/' + url, {
                method: _method,
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + user
                },
                mode: 'cors',
                cache: 'default',
                body: (payload === "") ? "" : JSON.stringify(payload)
            });
            if (!object_pickup.ok) {
                    let error = await object_pickup.json();
                    throw error.error;
                }
            else {
                fetched_object = await object_pickup.json();
                console.log("action returned: " + JSON.stringify(fetched_object));
                updateDisplayedEntries(); // aggiorna le entry su schermo
            }
        } catch(error) {
            alert("Errore: " + error);
        }
    }
    return sendData();
}


/** Richiede i dati di una determinata categoria al backend, 
 *  e li mostra a schermo.
 */
function fetchDataFromServer(url){
    const fetchdata = async () => {
        try {
            let res = await fetch('http://localhost:8000/api/' + url, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                cache: 'default',
            });
            if (!res.ok) {
                let error = await res.json();
                throw error.error;
            }
            else {
                fetchedData = await res.json();
                window.sessionStorage.setItem("latest_fetch", JSON.stringify(fetchedData.data));
                displayData(fetchedData.data);
            }
        } catch(error) {
            console.log("couldnt fetch data, " + error);
        }
    }
    return fetchdata();
}


function fetchProtectedDataFromServer(url, user){
    const fetchdata = async () => {
        try {
            let res = await fetch('http://localhost:8000/api/' + url, {
                method: 'GET',
                headers: {'Content-Type': 'application/json',
                        'Authorization': "Bearer " + user   
                },
                mode: 'cors',
                cache: 'default',
            });
            if (!res.ok) {
                let error = await res.json();
                throw error.error;
            }
            else {
                fetchedData = await res.json(); 
                console.log(JSON.stringify(fetchedData.data));
                window.sessionStorage.setItem("latest_fetch", JSON.stringify(fetchedData.data));

                displayData(fetchedData.data);
            }
        } catch(error) {
            console.log("couldnt fetch data, " + error);
        }
    }
    return fetchdata();
}
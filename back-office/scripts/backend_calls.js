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
            if (!object_pickup.ok) throw new Error();
            else {
                fetched_object = await object_pickup.json();
                console.log("action returned: " + JSON.stringify(fetched_object));
                updateDisplayedEntries(); // aggiorna le entry su schermo
            }
        } catch(error) {
            console.log(error);
            alert("Error sending data... " + error.code);
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
            if (!res.ok) throw new Error("erroraccio");
            else {
                fetchedData = await res.json();
                window.sessionStorage.setItem("latest_fetch", JSON.stringify(fetchedData.data));
                displayData(fetchedData.data);
            }
        } catch(error) {
            console.log("couldnt fetch data");
        }
    }
    return fetchdata();
}




//// FUNZIONI LEGACY, VERRANNO ELIMINATE QUASI SUBITO ///////


// /** Invia un payload con i dati per l'aggiunta di una entry determinata
//  * 
//  */ 
// function createElement(payload, url, user){
//     console.log("Bearer " + user);
//     const sendData = async () => {
//         try {
//             let object_pickup = await fetch('http://localhost:8000/api/' + url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json', 
//                     'Authorization': "Bearer " + user
//                 },    
//                 mode: 'cors',
//                 cache: 'default',
//                 body: (payload === "") ? "" : JSON.stringify(payload)
//             });    
//             if (!object_pickup.ok) throw new Error("erroraccio");
//             else {
//                 fetched_object = await object_pickup.json();
//                 console.log("action returned: " + fetched_object);
//                 updateDisplayedEntries();
//             }    
//         } catch(error) {
//             alert("Error sending data... " + error);
//         }    
//     }    

//     return sendData();
// }    


// /** Invia un payload con i dati per l'eliminazione di una entry determinata
//  * 
//  */ 
// function deleteElement(url, user){
//     console.log("Bearer " + user);
//     const sendData = async () => {
//         try {
//             let object_pickup = await fetch('http://localhost:8000/api/' + url, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json', 
//                     'Authorization': "Bearer " + user
//                 },    
//                 mode: 'cors',
//                 cache: 'default',
//             });    
//             if (!object_pickup.ok) throw new Error("erroraccio");
//             else {
//                 fetched_object = await object_pickup.json();
//                 console.log("action returned: " + fetched_object);
//                 updateDisplayedEntries(); // aggiorna le entry su schermo
//             }    
//         } catch(error) {
//             alert("Error sending data... " + error);
//         }    
//     }    
//     return sendData();
// }    





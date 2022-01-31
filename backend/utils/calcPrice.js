const {genArrayOfDates} =  require("./CheckAvaiability");

function calcPrice(rent, car, simulation) {
    let finalPrice = 0; //prezzo finale comprese ore
    let discount = 0;   //sconto totale comprese ore
    let totalPrice = 0; //prezzo kit e modello comprese ore

    let kitsPrice = 0;  //prezzo dei kit
    let modelPrice = car.basePrice; //prezzo del modello
    let penal = 0;
    

    let totalHours = 0; //ore totali
    let hoursDiscount = 0; //ore sconto
    
    //calcolo prezzo modello
    if (car.condition === "perfect") {
        modelPrice *= 1.2;
    } else if (car.condition === "good") {
        modelPrice *= 1.1
    }

    //calcolo ore totali
    if (rent.type === "period") {
        let dates = genArrayOfDates(
            rent.period.from,
            rent.period.to,
            rent.period.since,
            rent.period.for,
            rent.period.singleDay
          );
        dates.forEach(date => {
            totalHours += (Math.abs(date.to - date.from) / 36e5);
            
        })

        //se noleggia per piu di 4 giorni la settimana 10% di sconto
        if (rent.period.from > rent.period.to) {
            const totalDays = Math.abs(rent.period.from - 7) + rent.period.to
            if (totalDays > 3) {
                hoursDiscount += (totalHours * 0.4);
            } else if (totalDays > 1)
            hoursDiscount += (totalHours * 0.2);

        } else if (rent.period.from < rent.period.to) {
            const totalDays = Math.abs(rent.period.from - rent.period.to)
            if (totalDays > 3) {
                hoursDiscount += (totalHours * 0.4);
            } else if (totalDays > 1)
                hoursDiscount += (totalHours * 0.2);
        }
        
        //se e' un noleggio classico per piu di una settimana 10% sconto
    } else {
        totalHours += (Math.abs(rent.classic.to - rent.classic.from) / 36e5);
        
        const totalDays = Math.floor(Math.abs(rent.classic.to - rent.classic.from) / 86400000)
            if (totalDays >= 7) {
                hoursDiscount += (totalHours * 0.1);
            }
    }

    

    //sconto per ogni kit
    if (rent.rentObj.kits && rent.rentObj.kits.length > 0) {
        rent.rentObj.kits.forEach(kit => {
            if (kit.price) {
                hoursDiscount += (0.005 * totalHours);
                kitsPrice += kit.price || 0;
            }
            
        })
    }

    //se lo sconto è troppo si normalizza a 0.2
    if (hoursDiscount > 0.15 * totalHours) hoursDiscount = 0.15 * totalHours;

    //se in ritardo sovrapprezzo
    if (rent.isLate) {
        penal = (kitsPrice + modelPrice) * totalHours * 0.25;
    }

    //calcolo sconto
    discount = (kitsPrice + modelPrice) * hoursDiscount

    //calcolo totale
    totalPrice = (kitsPrice + modelPrice) * totalHours;

    //calcolo prezzo finale
    finalPrice = totalPrice - discount + penal;

    if (simulation) {
        let info = {
            finalPrice,
            modelPrice,
            kitsPrice,
            discount,
            penal,
            totalHours
        }
        return info
    } else return finalPrice
}

module.exports = calcPrice;
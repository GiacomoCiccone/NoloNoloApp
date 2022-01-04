const genArrayOfDates =  require("./CheckAvaiability");

function calcPrice(rent, car) {
    let price = car.basePrice;
    //perfect | good | weak
    car.condition === "perfect" ? price = price * 1.2 : car.condition === "good" ? price = price * 1.1 : price = price * 1;
    let hours = 0;
    //period | classic
    if (rent.type === "period") {
        let dates = genArrayOfDates(
            rent.period.from,
            rent.period.to,
            rent.period.since,
            rent.period.for,
            rent.period.singleDay
          );
        dates.forEach(date => {
            hours += (Math.abs(date.to - date.from) / 36e5);
        })
        if (rent.period.from > rent.period.to) {
            const totalDays = Math.abs(rent.period.from - 7) + rent.period.to
            if (totalDays > 4) {
                hours *= 0.9;
            }
        } else if (rent.period.from < rent.period.to) {
            const totalDays = Math.abs(rent.period.from - rent.period.to)
            if (totalDays > 4) {
                hours *= 0.9;
            }
        }
        
    } else {
        hours += (Math.abs(rent.classic.to - rent.classic.from) / 36e5);
    }

    if (rent.rentObj.kits && rent.rentObj.kits.length > 0) {
        rent.rentObj.kits.forEach(kit => hours *= 0.97)
    }

    if (rent.state === "expired") {
        hours *= 1.25;
    }

    return price * hours;
}

module.exports = calcPrice;
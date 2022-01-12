function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
  return !(a_start <= b_end && a_end >= b_start);
}

function genArrayOfDates(from, to, since, period, singleDay) {
  let date = [];
  let current = new Date(since);

  if (from < to) {
    for (let week = 0; week < period; week++) {
      let a = new Date(current);
      let b = new Date(current.getTime() + Math.abs(from - to) * 86400000);
      date.push({
        from: new Date(a.setUTCHours(0, 0, 0, 0)),
        to: new Date(b.setUTCHours(23, 59, 59, 999)),
      });
      current.setDate(current.getDate() + 7);
    }
  } else if (from > to) {
    for (let week = 0; week < period; week++) {
      let a = new Date(current);
      let b = new Date(
        current.getTime() + (Math.abs(from - 7) + to) * 86400000
      );
      date.push({
        from: new Date(a.setUTCHours(0, 0, 0, 0)),
        to: new Date(b.setUTCHours(23, 59, 59, 999)),
      });
      current.setDate(current.getDate() + 7);
    }
  } else {
    if (singleDay) {
      for (let week = 0; week < period; week++) {
        let a = new Date(current);
        let b = new Date(current);
        date.push({
          from: new Date(a.setUTCHours(0, 0, 0, 0)),
          to: new Date(b.setUTCHours(23, 59, 59, 999)),
        });
        current.setDate(current.getDate() + 7);
      }
    } else {
      for (let week = 0; week < period; week++) {
        let a = new Date(current);
        let b = new Date(current.getTime() + 7 * 86400000);
        date.push({
          from: new Date(a.setUTCHours(0, 0, 0, 0)),
          to: new Date(b.setUTCHours(23, 59, 59, 999)),
        });
        current.setDate(current.getDate() + 7);
      }
    }
  }
  return date;
}

function checkAvailability(history, car, rentRequest) {
  let available = true;

  //si assicura che sia una data
  if (rentRequest.type === "classic") {
    rentRequest.classic.from = new Date(rentRequest.classic.from);
    rentRequest.classic.to = new Date(rentRequest.classic.to);
  }

  //controlla con le date di non disponibilita della macchina
  if (car.unavaiable.from) {
    switch (rentRequest.type) {
      case "period":
        const arrayDates = genArrayOfDates(
          rentRequest.period.from,
          rentRequest.period.to,
          rentRequest.period.since,
          rentRequest.period.for,
          rentRequest.period.singleDay
        );
        arrayDates.forEach((date) => {
          if (
            !dateRangeOverlaps(
              date.period.from.getTime(),
              date.period.to.getTime(),
              car.unavaiable.from.getTime(),
              car.unavaiable.to.getTime() || new Date(8640000000000000).getTime()
            )
          ) {
            available = false;
          }
        });
        break;

      default:
        if (
          !dateRangeOverlaps(
            rentRequest.classic.from.getTime(),
            rentRequest.classic.to.getTime(),
            car.unavaiable.from.getTime(),
            car.unavaiable.to.getTime() || new Date(8640000000000000).getTime()
          )
        ) {
          available = false;
        }
        break;
    }
  }

  //controlla per ogni rent nella history dell'auto
  history.forEach((rent) => {
    rent = rent.toObject();
    //salta il rent in questione che dev'essere modificato
    if (rentRequest.id && rentRequest.id.equals(rent._id));
    else {
      switch (rent.type) {
        case "period":
          switch (rentRequest.type) {
            //periodico - periodico
            case "period":
              const arrayDates1 = genArrayOfDates(
                rent.period.from,
                rent.period.to,
                rent.period.since,
                rent.period.for,
                rent.period.singleDay
              );
              const arrayDates2 = genArrayOfDates(
                rentRequest.period.from,
                rentRequest.period.to,
                rentRequest.period.since,
                rentRequest.period.for,
                rentRequest.period.singleDay
              );
              arrayDates1.forEach((date1) => {
                arrayDates2.forEach((date2) => {
                  if (
                    !dateRangeOverlaps(
                      date1.from.getTime(),
                      date1.to.getTime(),
                      date2.from.getTime(),
                      date2.to.getTime()
                    )
                  ) {
                    available = false;
                  }
                });
              });
              break;

            //classico - periodico
            default:
              const arrayDates = genArrayOfDates(
                rent.period.from,
                rent.period.to,
                rent.period.since,
                rent.period.for,
                rent.period.singleDay
              );
              arrayDates.forEach((date) => {
                if (
                  !dateRangeOverlaps(
                    rentRequest.classic.from.getTime(),
                    rentRequest.classic.to.getTime(),
                    date.from.getTime(),
                    date.to.getTime()
                  )
                ) {
                  available = false;
                }
              });
              break;
          }
          break;

        default:
          switch (rentRequest.type) {
            //classico - periodico
            case "period":
              const arrayDates = genArrayOfDates(
                rentRequest.period.from,
                rentRequest.period.to,
                rentRequest.period.since,
                rentRequest.period.for,
                rentRequest.period.singleDay
              );
              arrayDates.forEach((date) => {
                if (
                  !dateRangeOverlaps(
                    date.from.getTime(),
                    date.to.getTime(),
                    rent.classic.from.getTime(),
                    rent.classic.to.getTime()
                  )
                ) {
                  available = false;
                }
              });

              break;
            //classico - classico
            default:
              if (
                !dateRangeOverlaps(
                  rentRequest.classic.from.getTime(),
                  rentRequest.classic.to.getTime(),
                  rent.classic.from.getTime(),
                  rent.classic.to.getTime()
                )
              ) {
                available = false;
              }
              break;
          }
          break;
      }
    }
  });

  return available;
}

module.exports = {
  checkAvailability, genArrayOfDates
}

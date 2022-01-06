//funzione middleware che gestisce gli errori globalmente

const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //duplicate key in mongodb
  if (err.code === 11000) {
    const message = `Spiacenti, i dati inseriti non sono disponibili.`;
    //bad request
    error = new ErrorResponse(message, 400);
  }

  //oggetto non trovato in mongodb
  if (err.name === "CastError") {
    const message = `Nessun risultato trovato`;
    //bad request
    error = new ErrorResponse(message, 404);
  }

  //errore nella validazione dei campi del modello in mongodb
  if (err.name === "ValidationError") {
    //crea un array dei valori dell'oggetto
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    error = new ErrorResponse(message, 400);
  }

  let emoji;

  error.statusCode === 404
    ? (emoji = " 😢")
    : error.statusCode === 400
    ? (emoji = " 😔")
    : (emoji = " ❌");

  //altrimenti e' un errore del server
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message + emoji || "Server Error" + emoji,
  });
};

module.exports = errorHandler;

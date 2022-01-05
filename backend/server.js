//require e' una funzione di Node.js per importare moduli
//module.exports permette di esportare moduli

//per usare il file di config basta questa dichiarazione all'inizio del file principale
require("dotenv").config({ path: "./config.env" });

const cors = require("cors");
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

//collega mongoose a mongo
connectDB();

const app = express();

//middleware per usare i dati nel body delle richieste. 5mb massimo body size
app.use(express.json({ limit: "5mb" }));
app.use(cors());

//serve static file from react app
app.use(express.static(path.join(__dirname, './frontend/build')));

//redirect verso routers
app.use("/api/auth", require("./routers/auth")); //tutte le richieste ad /api/auth vengono mandate a /routers/auth
app.use("/api/users", require("./routers/users"));
app.use("/api/pickups", require("./routers/pickups"));
app.use("/api/cars", require("./routers/cars"));
app.use("/api/rents", require("./routers/rents"));
app.use("/api/kits", require("./routers/kits"));


// redirect everything else to the frontend
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './frontend/build', 'index.html'));
});


//L'errorHandler deve essere l'ultimo middleware
app.use(errorHandler);

//se e' definita nel config file prendiamo quella porta altrimenti la 5000
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

//funzione per uccidere "gentilmente" il server senza crash
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged: ${err}`);
  //chiude tutte le connessioni e poi uccide il processo
  server.close(() => process.exit(1));
});

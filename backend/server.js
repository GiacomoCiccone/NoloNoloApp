//require e' una funzione di Node.js per importare moduli
//module.exports permette di esportare moduli

//per usare il file di config basta questa dichiarazione all'inizio del file principale
require("dotenv").config({ path: "./config.env" });
const bodyParser = require('body-parser')
const cors = require("cors");
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const Users = require("./models/Users");
const Rents = require("./models/Rents");
const Cars = require("./models/Cars");
const Kits = require("./models/Kits");
const Pickups = require("./models/Pickups");

//collega mongoose a mongo
connectDB();

const app = express();

//middleware per usare i dati nel body delle richieste
app.use(bodyParser.json());
app.use(cors());

//serve static file from react app
app.use(express.static(path.join(__dirname, './frontend/build')));
//serve static file from vue app
app.use(express.static(path.join(__dirname, './dashboard/dist')));
//serve static file from jquery app
app.use(express.static(path.join(__dirname, './back-office')));

//serve static file from jquery app
app.use(express.static(path.join(__dirname, './back-office/style')));


//redirect verso routers
app.use("/api/auth", require("./routers/auth")); //tutte le richieste ad /api/auth vengono mandate a /routers/auth
app.use("/api/users", require("./routers/users"));
app.use("/api/pickups", require("./routers/pickups"));
app.use("/api/cars", require("./routers/cars"));
app.use("/api/rents", require("./routers/rents"));
app.use("/api/kits", require("./routers/kits"));


//funzione per leggere lo stato del database
app.get("/db/state", async function(req, res, next) {
  try {
    const users = await Users.find({})
    const cars = await Cars.find({})
    const rents = await Rents.find({})
    const kits = await Kits.find({})
    const pickups = await Pickups.find({})

    res.status(200).json({success: true, data: {
      users, cars, rents, kits, pickups
    }})
  } catch (error) {
    return next(error)
  }
})

// redirect to the back-office home
app.get(['/back-office/', '/back-office/index.html'], function (req, res) {
  res.sendFile(path.join(__dirname, './back-office', 'index.html'));
});

// redirect to the back-office home
app.get(['/back-office/users' ,'/back-office/users.html'], function (req, res) {
  res.sendFile(path.join(__dirname, './back-office', 'users.html'));
});

// redirect to the back-office home
app.get(['/back-office/rents' ,'/back-office/rents.html'], function (req, res) {
  res.sendFile(path.join(__dirname, './back-office', 'rents.html'));
});

// redirect to the back-office home
app.get(['/back-office/kits' ,'/back-office/kits.html'], function (req, res) {
  res.sendFile(path.join(__dirname, './back-office', 'kits.html'));
});

// redirect to the back-office home
app.get(['/back-office/pikcups' ,'/back-office/pickups.html'], function (req, res) {
  res.sendFile(path.join(__dirname, './back-office', 'pickups.html'));
});

// redirect to the back-office home
app.get(['/back-office/login' ,'/back-office/login.html'], function (req, res) {
  res.sendFile(path.join(__dirname, './back-office', 'login.html'));
});

// redirect to the dashboard
app.get('/dashboard/*', function (req, res) {
  res.sendFile(path.join(__dirname, './dashboard/dist', 'index.html'));
});

// redirect everything else to the frontend
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './frontend/build', 'index.html'));
});


//L'errorHandler deve essere l'ultimo middleware
app.use(errorHandler);

//se e' definita nel config file prendiamo quella porta altrimenti la 8000
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

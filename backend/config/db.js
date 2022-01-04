const mongoose = require("mongoose");

//funzione per collegare mongoose a mongoDB
//per aviare mongodb (assumendo sia installato) fare sudo systemctl start mongod
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  console.log("MongoDB connected");
};

module.exports = connectDB;

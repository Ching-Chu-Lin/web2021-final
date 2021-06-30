import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

function connectMongo() {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  mongoose.set("useFindAndModify", false);

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("mongo connected!");
  });
}

const mongo = {
  connect: connectMongo,
};

export default mongo;

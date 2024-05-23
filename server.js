const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const mapRoute = require("./routes").mapRoute;
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path"); //改
const port = process.env.PORT || 8080; //改

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 連結MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });



// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "client" ,"build"))) //改

app.use("/api/map", mapRoute);
// course route應該被jwt保護
// 如果request header內部沒有jwt，則request就會被視為是unauthorized

//改
if(
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*",(req,res) =>{
    res.sendFile(path.join(__dirname, "client" , "build" ,"index.html"))
  })
}
app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
  console.log("後端伺服器聆聽在port...");
});

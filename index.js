const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

app.use(require("./routes/index.js"));
app.get('/',(req,res)=>{
  console.log("server is ")
})

app.listen(8080, () => {
  console.log(`Server is running on port ${8080}`);
});

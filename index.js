  const express = require("express");
  const dotenv = require("dotenv");
  const cors = require("cors");
  const logger = require("morgan");
  const bodyParser = require("body-parser");
  const {connectPostgresql}=require("./DB/db.config.js")
  const config = require("./dbconfig.js");
  const sql = require('mysql');
  const app = express();
  dotenv.config();
  connectPostgresql()

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger("dev"));

  app.get('/',(req,res)=>{
    res.send("server is running on Aws")
  })
  app.use(require("./routes/index.js"));

     


  app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
  });

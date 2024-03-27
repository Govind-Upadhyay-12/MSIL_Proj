const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const dotenv = require("dotenv").config();

module.exports.ValidPassword = async (plainPassword, hashedPassword) => {
  return plainPassword === hashedPassword;
};

module.exports.generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: "1d" });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("originalfile",file)
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log("file ka naam",file.originalname)
    cb(null, file.originalname);
  },
}); 

module.exports.upload = multer({ storage: storage });
;

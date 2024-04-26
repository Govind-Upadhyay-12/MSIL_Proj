const multer = require("multer");

const storage_email = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});


const upload_email = multer({
    storage: storage_email,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

module.exports.upload_email = upload_email;

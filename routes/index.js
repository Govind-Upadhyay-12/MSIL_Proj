const router = require("express").Router();
const user = require("./user.js");
const admin=require("./admin.js")

router.get("/api/user", (req, res) => {
  res.send("Welcome to MSIL brother");
});
router.use('/api/admin',admin);
router.use("/api/user", user);

module.exports = router;

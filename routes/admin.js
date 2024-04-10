const router = require("express").Router();
const {addCourse, assignCourse,Addadds} = require("../controllers/admin.controller.js");
const { upload } = require("../helper/helper.js");

router.get("/addCourse", (req, res) => {
  res.send("hey i am uploading course");
});
router.post("/addCourse", upload.single("file"), addCourse);
router.post("/Ads",upload.single("file"),Addadds);
router.post("/assignCourse", assignCourse);

module.exports = router;

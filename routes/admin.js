const router = require("express").Router();
const {addCourse, assignCourse,Addadds,GettingAdds,findCourseByCategory,Admin_login,All_Courses,GetCategory,fileUploadGet, initialize_table, map_component} = require("../controllers/admin.controller.js");
const { upload } = require("../helper/helper.js");
const auth=require("../middleware/auth_token.js")
router.get("/addCourse", (req, res) => {
  res.send("hey i am uploading course");
});
router.post("/admin_login",Admin_login)
router.post("/addCourse",auth, upload.single("file"), addCourse);
router.post("/Ads",upload.single("file"),Addadds);
router.post("/assignCourse", auth,assignCourse);
router.get('/GetAllAds',auth,GettingAdds);
router.get('/modules_by_category',auth,findCourseByCategory)
router.post('/getCourses',auth,All_Courses)
router.get('/getAllCategoryList',auth,GetCategory)
router.get('/uploads/:fileName',fileUploadGet)
router.post('/initialize-table',initialize_table)
router.post('/map-component',map_component)

module.exports = router;

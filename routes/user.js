const { login, getAllCourses,GetParticularCourse,GetUser, SearchCourse, sendMail } = require('../controllers/user.controller');
const {upload}=require("../helper/helper.js")
const auth=require("../middleware/auth_token.js")

const router = require('express').Router();


router.get('/getCourses',auth, getAllCourses);
router.get('/Courseget/:id',GetParticularCourse);
router.get('/getUser/',auth,GetUser);
router.post('/login',auth,login);
router.post('/course_search/',auth,SearchCourse)
router.post('/Contact_us',upload.single("file"), sendMail)

module.exports = router;

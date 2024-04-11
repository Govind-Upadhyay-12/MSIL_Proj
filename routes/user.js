const { login, getAllCourses,GetParticularCourse,GetUser, SearchCourse, sendMail } = require('../controllers/user.controller');
const {upload}=require("../helper/helper.js")

const router = require('express').Router();


router.get('/getCourses/:id', getAllCourses);
router.get('/Courseget/:id',GetParticularCourse);
router.get('/getUser/:id',GetUser);
router.post('/login', login);
router.post('/course_search/:id',SearchCourse)
router.post('/Contact_us',upload.single("file"), sendMail)

module.exports = router;

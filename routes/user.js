const { login, getAllCourses,GetParticularCourse,GetUser } = require('../controllers/user.controller');

const router = require('express').Router();


router.get('/getCourses/:id', getAllCourses);
router.get('/Courseget/:id',GetParticularCourse);
router.get('/getUser/:id',GetUser);
router.post('/login', login);

module.exports = router;

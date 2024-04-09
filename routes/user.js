const { login, getAllCourses,GetParticularCourse } = require('../controllers/user.controller');

const router = require('express').Router();


router.get('/getCourses/:id', getAllCourses);
router.get('/Courseget/:id',GetParticularCourse);
router.post('/login', login);

module.exports = router;

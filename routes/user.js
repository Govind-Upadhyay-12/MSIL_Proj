const { login, getAllCourses } = require('../controllers/user.controller');

const router = require('express').Router();


router.get('/getCourses/:id', getAllCourses);
router.post('/login', login);

module.exports = router;

const express = require('express')
const router = express.Router()
const { studentRegister, teacherRegister, login} = require('../controllers/auth')

router.post('/student/register', studentRegister)
router.post('/teacher/register', teacherRegister)
router.get('/login', login)

module.exports = router

const express = require("express");
const router = express.Router();
const {
  studentRegister,
  teacherRegister,
  login,
  feedData,
} = require("../controllers/auth");

router.post("/auth/register/student", studentRegister);
router.post("/auth/register/teacher", teacherRegister);
router.post("/auth/login", login);
router.get("/feed/:email", feedData);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  studentRegister,
  teacherRegister,
  login,
  feedData,
  generateSession,
  markData,
  deleteSession,
} = require("../controllers/auth");

router.post("/auth/register/student", studentRegister);
router.post("/auth/register/teacher", teacherRegister);
router.post("/auth/login", login);
router.get("/feed/:email", feedData);
router.post("/generate/session", generateSession)
router.post("/mark", markData)
router.get("/delete/:base", deleteSession)
module.exports = router;

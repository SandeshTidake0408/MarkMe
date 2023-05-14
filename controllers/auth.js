const User = require("../models/student");
const { StatusCodes } = require("http-status-codes");
const teacher = require("../models/teacher");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const mongoose = require("mongoose");
const Session = require("../models/session");

const studentRegister = async (req, res) => {
  const {
    firstName,
    lastName,
    div,
    branch,
    rollNo,
    mobileNo,
    email,
    password,
    confPassword,
  } = req.body;

  if (password != confPassword) {
    throw new BadRequestError("Password and confirm password do not match");
  } else {
    const user = await User.create({
      firstName,
      lastName,
      div,
      branch,
      rollNo,
      mobileNo,
      email,
      password,
      teacher: false,
    });

    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      firstName,
      lastName,
      div,
      branch,
      rollNo,
      email,
      teacher: false,
      token,
    });
  }
  console.log("in student register");
};

const teacherRegister = async (req, res) => {
  const { firstName, lastName, email, password, confPassword } = req.body;
  if (password != confPassword) {
    throw new BadRequestError("Password and confirm password do not match");
  } else {
    const user = await teacher.create({
      firstName,
      lastName,
      email,
      password,
      teacher: true,
    });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      firstName,
      lastName,
      email,
      teacher: true,
      token,
    });
  }
  console.log("in teacher register");
};

const login = async (req, res) => {
  console.log("start of login");
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide both email and password");
  }
  let user = await teacher.findOne({ email });
  if (!user) {
    user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    message: "sending loging data",
    user: user.teacher,
    email_id: user.email,
    token,
  });
};

const feedData = async (req, res) => {
  const email = req.params.email;
  let user = await teacher.findOne({ email });
  if (!user) {
    user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("User not found");
    }
  }
  if (user.teacher === false) {
    res.status(StatusCodes.OK).json({
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userRollNo: user.rollNo,
      userBranch: user.branch,
      userDiv: user.div,
      userEmail: user.email,
      userType: "Student",
    });
  } else {
    res.status(StatusCodes.OK).json({
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.email,
      userType: "Teacher",
    });
  }
};

const generateSession = async (req, res) => {
  console.log("start of generate session");
  const { base, key, subject, year, branch, div } = req.body;
  const checkBase = await Session.findOne({ base });
  if (checkBase) {
    throw new BadRequestError("Already session is present with same key");
  } else {
    const newSession = await Session.create({
      base,
      key,
      subject,
      branch,
      year,
      div,
      folder: [],
    });
    res.status(StatusCodes.CREATED).json({
      msg: `Session Created Successfully with code ${key}`,
      newSession,
    });
  }
  console.log("end of genearte session");
};

const markData = async (req, res) => {
  console.log("start of mark data");
  const { key, subject, rollNo, email } = req.body;
  const base = `${subject}_${key}`;

  const user = await User.findOne({ email });
  if(!user){
    return res.send("No user present")
  }
  const presentSession = await Session.findOne({base})
  if (!presentSession) {
    return res.status(StatusCodes.BAD_REQUEST).send("Attention: Session not found or it appears you may be running late. ")
  }
  console.log(user)
  console.log(presentSession)
  if (user.div != presentSession.div || user.branch != presentSession.branch) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Student not belong to same class" })
  }
  const result = await Session.updateOne(
    { base },
    { $push: { folder: rollNo } }
  );

  if (result.nModified === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        "Attention: Session not found or it appears you may be running late."
      );
  }

  res.status(StatusCodes.CREATED).send(
    `Marked data for session with key ${key} and subject ${subject}`
  );
  console.log("end of markData");
};

const deleteSession = async (req, res) => {
  const base = req.params.base;
  const {email}= req.body;
  const user=await teacher.findOne({email})
  if(!user.teacher){
    return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized Action");
  }
  const lecture = await Session.findOneAndDelete({ base: base });
  if (!lecture) {
    return res.status(404).json({ msg: `No session with base : ${base}` });
  }
  res.status(200).json({ msg: "Session found and deleted Successfully" });
};

module.exports = {
  studentRegister,
  teacherRegister,
  login,
  feedData,
  generateSession,
  markData,
  deleteSession,
};

const User = require("../models/student");
const { StatusCodes } = require("http-status-codes");
const teacher = require("../models/teacher");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const mongoose = require('mongoose');
const Session = require('../models/session');

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
    res
      .status(StatusCodes.CREATED)
      .json({ firstName, lastName, email, teacher: true, token });
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
      userClass: user.branch,
      userDiv: user.div,
      userEmail: user.email,
    });
  } else {
    res.status(StatusCodes.OK).json({
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.email,
    });
  }
}

const generateSession = async (req , res)=>{
  console.log('start of generate session')
  const {base , key , subject} = req.body;
  const checkBase = await Session.findOne({base})
  if (checkBase) {
    throw new BadRequestError("Already session is present with same key");
  } else {
    const newSession = await Session.create({
      base, key , subject , folder:[]
    });
    res
      .status(StatusCodes.CREATED)
      .json({msg: `new session created with key ${key}` , newSession});
  }
  console.log('end of genearte session')
}

const markData = async (req, res) => {
  console.log('start of mark data');
  const { key, subject, rollNo } = req.body;
  const base = `${subject}_${key}`;
  
  const result = await Session.updateOne(
    { base },
    { $push: { folder: rollNo  } }
  );
  
  if (result.nModified === 0) {
    return res.status(StatusCodes.BAD_REQUEST).send('Session not found or you are late');
  }

  res.status(StatusCodes.CREATED).send(`Marked data for session with key ${key} and subject ${subject}`);
  console.log('end of markData');
}

module.exports = {
  studentRegister,
  teacherRegister,
  login,
  feedData,
  generateSession,
  markData,
};

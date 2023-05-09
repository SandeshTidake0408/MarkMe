const User = require("../models/student");
const { StatusCodes } = require("http-status-codes");
const teacher = require("../models/teacher");
const { BadRequestError, UnauthenticatedError } = require("../errors");

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

module.exports = {
  studentRegister,
  teacherRegister,
  login,
  feedData,
};

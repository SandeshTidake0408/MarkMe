const User = require("../models/student");
const { StatusCodes } = require("http-status-codes");
const teacher = require("../models/teacher");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const mongoose = require("mongoose");
const Session = require("../models/session");
const geoip = require('geoip-lite');
// student register

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

// teacher register

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

// common login for both teacher and student
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
    const { base, key, subject, year, branch, div, latitude, longitude } =
        req.body;
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
            latitude,
            longitude,
            // altitude,
        });
        res.status(StatusCodes.CREATED).json({
            msg: `Session Created Successfully with code ${key}`,
            newSession,
        });
    }
    console.log("end of genearte session");
};

// ${key} `Marked data for session with key and subject ${subject}`
const markData = async (req, res) => {
    console.log("start of mark data");
    const {
        key,
        subject,
        email,
        studentLat,
        studentLon,
        studentAlt,
        deviceId,
    } = req.body;

    const base = `${subject}_${key}`;
    const presentSession = await Session.findOne({ base });
    if (!presentSession) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg: "Attention: Session not found or it appears you may be running late.",
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.send({ msg: "No user present" });
    }

    console.log("i am here");
    const checkRollNo = await Session.findOne({
        base: base,
        folder: { $elemMatch: { rollNo: user.rollNo } },
    });
    console.log(checkRollNo);
    if (checkRollNo) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Already Mark!!!",
        });
    }

    const ip = await Session.findOne({
        base: base,
        deviceIdArray: { $elemMatch: { deviceId: deviceId } },
    });
    const geo = geoip.lookup(clientIP);

    // Check if the IP is outside India
    if (geo && geo.country !== 'IN') {
        // IP is outside India, block the request
        return res.status(403).send('Access denied. IP address outside India.');
    }
    console.log(ip);
    if (ip) {
        return res.status(StatusCodes.CONFLICT).json({
            // msg:"Don't ever try too cheat! MArkMe is watching 👀 you",
            msg: "Na Munna Na !!! MarkMe is 👀 you",
        });
    }
    const distance = calculateDistance(
        presentSession.latitude,
        presentSession.longitude,
        studentLat,
        studentLon
    );
    console.log(distance);
    // const height = abs(studentAlt - presentSession.altitude);

    if (distance > 0.035) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send({ msg: "You are not in range!!!" });
    }

    if (
        user.div != presentSession.div ||
        user.branch != presentSession.branch
    ) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Student not belong to same class" });
    }
    const result = await Session.updateOne(
        { base },
        {
            $push: {
                folder: {
                    rollNo: user.rollNo,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                deviceIdArray: {
                    deviceId: deviceId,
                },
            },
        }
    );

    if (result.nModified === 0) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg: "Attention: Session not found or it appears you may be running late.",
        });
    }

    res.status(StatusCodes.CREATED).send({
        msg: "Attendance Marked Successfully",
    });
    console.log("end of markData");
};

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    console.log(lat1, " ", lon1, " ", lat2, " ", lon2);
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

const deleteSession = async (req, res) => {
    const base = req.params.base;
    const { email } = req.body;
    const user = await teacher.findOne({ email });
    if (!user.teacher) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized Action");
    }
    const lecture = await Session.findOneAndDelete({ base: base });
    if (!lecture) {
        return res.status(404).json({ msg: "Session Not Found !!" });
    }
    res.status(200).json({ msg: "Session deleted Successfully" });
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

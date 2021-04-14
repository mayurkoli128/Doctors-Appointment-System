const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
require('dotenv').config();


// if user trying to get private routes authenticate the route first then allow user to enter in
module.exports.auth = async function(req, res, next) {
    let token = req.cookies.auth_token;
    if(!token) {
        return res.status(401).json({ok: false, message: 'Unauthorized'});
    }
    try {
        const {email} = jwt.verify(token, process.env.JWT_PRIVATE_TOKEN||"UNSECURED_JWT_PRIVATE_TOKEN");
        const patient = (await Patient.find({email: email}, ["id", "email", "phoneNo", "firstName", "lastName", "gender", "dob"]))[0];
        if (!patient) {
            return res.status(401).json({ok: false, message: 'Sorry, you are not allowed to access this page'});
        }
        req.patient = patient;
        return next();
    } catch (error) {
        return next(error);
    }
}
// if token is valid and user trying to login or register render user to dashboard directly...
module.exports.forwardAuthenticate = async function(req, res, next) {
    token = req.cookies.auth_token;
    if(!token) {
        return next();
    }
    try {
        const {email} = jwt.verify(token, process.env.JWT_PRIVATE_TOKEN || "UNSECURED_JWT_PRIVATE_TOKEN");
        const patient = (await Patient.find({email: email}))[0];

        if (!patient) {
            return next();
        }
        req.patient = patient;
        return res.status(206).redirect('../patientDashboard');
    } catch (error) {
        return next(error);
    }
}
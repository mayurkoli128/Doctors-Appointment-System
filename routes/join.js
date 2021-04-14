const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Patient = require('../models/patient');
const Admin = require('../models/admin');
const AdminSetting = require('../models/adminSetting');
const {forwardAuthenticate} = require('../middleware/auth');
const {adminForwardAuthenticate} = require('../middleware/adminAuth');

// @type    POST
// @route   /api/auth/login
// @desc    route for user Login using username and password (page render)
// @access  PUBLIC 
router.get('/login', [forwardAuthenticate],(req, res) => {
    res.render('login', {
        err : req.flash('error'), 
        success_msg: req.flash('success_msg'),
    });
});

// @type    POST
// @route   /api/auth/login
// @desc    route for user Login using username/username and password
// @access  PUBLIC 
router.post('/login', async (req, res) => {

    let patient = (await Patient.find({email: req.body.email}))[0];
    if (!patient) {
        return res.status(401).render('login', {err: 'email or Password is incorrect'});
    } 
    const validatePass = await bcrypt.compare(req.body.password, patient.password);
    if (!validatePass) {
        return res.status(401).render('login', {err: 'email or Password is incorrect'});
    }
    let maxAge = 60*60*24;
    const token = new Patient(patient).generateAuthToken();
    res.cookie('auth_token', token, {httpOnly: true, maxAge: 1000*maxAge});
    res.status(200).redirect('../patientDashboard');
});

// @type    GET
// @route   /api/users/register
// @desc    route for user to register
// @access  PUBLIC 
router.get('/register', [forwardAuthenticate], (req, res)=> {
    res.render('register');
});

// @type    POST
// @route   /api/users/register
// @desc    route for user to register
// @access  PRIVATE 
router.post('/register', async(req, res) => {
    const {error} = Patient.validate(req.body);
    if (error) {
        return res.status(401).render('register', {err: error.details[0].message})
    }
    // make sure that username is unique..
    let patient = (await Patient.find({email: req.body.email}))[0];
    
    if(patient) {
        return res.status(409).render('register', {err: 'Sorry! email already taken.'});
    }
    patient = (await Patient.find({phoneNo: req.body.phoneNo}))[0];
    
    if(patient) {
        return res.status(409).render('register', {err: 'Sorry! phone no. already exist.'});
    }
    //if valid create patient object.
    patient = new Patient(_.pick(req.body, ["email", "firstName", "lastName", "gender", "dob", "phoneNo"]));
    //create hash of password.
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(req.body.password, salt);
    //insert into database
    await patient.save();
    //send patient object in response (use lodash for selecting properties of patient)

    // send json web token in response...
    let maxAge = 60*60*24 ;
    let token = patient.generateAuthToken();
    res.cookie('auth_token', token, {httpOnly: true, maxAge: 1000*maxAge});
    res.status(200)
        .redirect('../patientDashboard');
});

generateAuthToken = (isAdmin=false)=> {
    const expiresIn = 60 * 60 * 24; // an hour
    let token = jwt.sign({
        email: this.email,
        isAdmin: isAdmin,
    }, process.env.JWT_PRIVATE_TOKEN || "UNSECURED_JWT_PRIVATE_TOKEN", {expiresIn: expiresIn});
    return token;
}
// @type    GET
// @route   /api/users/register
// @desc    route for user to register
// @access  PUBLIC 
router.get('/register', [forwardAuthenticate], (req, res)=> {
    res.render('register');
});

// @type    POST
// @route   /api/auth/login
// @desc    route for user Login using username and password (page render)
// @access  PUBLIC 
router.get('/adminLogin', [adminForwardAuthenticate],(req, res) => {
    res.render('adminLogin', {
        err : req.flash('error'), 
        success_msg: req.flash('success_msg'),
    });
});

// @type    POST
// @route   /api/auth/login
// @desc    route for user Login using username/username and password
// @access  PUBLIC 
router.post('/adminLogin', async (req, res) => {
    const {error} = Admin.validate(req.body);
    if (error) {
        return res.status(401).render('adminLogin', {err: error.details[0].message})
    }
    let admin = await Admin.find({username: req.body.username});
    if (!admin) {
        return res.status(401).render('adminLogin', {err: 'username or Password is incorrect'});
    } 
    const validatePass = await bcrypt.compare(req.body.password, admin.password);
    if (!validatePass) {
        return res.status(401).render('adminLogin', {err: 'username or Password is incorrect'});
    }
    let maxAge = 60*60*24;
    const twofaAuth = await AdminSetting.find({adminId: admin.id, name: "2fa"});
    if (twofaAuth[0]) {
        maxAge = 2*60;
    }
    const token = new Admin(admin).generateAuthToken(true);
    res.cookie('auth_token', token, {httpOnly: true, maxAge: 1000*maxAge});
    // check if user has 2fa activated or not ...

    if (twofaAuth[0]) {
        return res.status(206).redirect('../settings/2fa/authenticate');
    }
    res.status(200).redirect('../adminDashboard');
});


module.exports = router;
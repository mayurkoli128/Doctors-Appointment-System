const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {adminAuth} = require('../middleware/adminAuth');

router.get('/', (req, res)=> {
    res.render('home');
});

// @type    GET
// @route   /api/users/me
// @desc    route for to get currently login user
// @access  PRIVATE 
router.get('/patientDashboard', [auth], async (req, res)=> {
    const patient = req.patient;
    // fetching all the records & ecnrypt them....
    res.status(200).render('patientDashboard', {
        patient: patient,
        err : req.flash('error'), 
        success_msg: req.flash('success_msg'),
    });
});

// @type    GET
// @route   /api/users/me
// @desc    route for to get currently login user
// @access  PRIVATE 
router.get('/adminDashboard', [adminAuth], async (req, res)=> {
    const admin = req.admin;
    // fetching all the records & ecnrypt them....
    res.status(200).render('adminDashboard', {
        admin: admin,
        err : req.flash('error')[0], 
        success_msg: req.flash('success_msg')[0],
        info: req.flash('info')[0]
    });
});

// @type    GET
// @route   /api/auth/logout
// @desc    route for patient to logout
// @access  PRIVATE 
router.get('/logout', (req, res) => {
    res.cookie('auth_token', "", {maxAge: 1});
    res.redirect('/');
});

module.exports=router;
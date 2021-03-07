const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const {auth} = require('../middleware/auth');
const _ = require('lodash');

// @type    GET
// @route   /api/secret/mine
// @desc    route for user to show his all secrets(page render)
// @access  PRIVATE 
router.get('/me', [auth], async (req, res)=> {
    const patient = req.patient;
    res.status(200).json({ok: true, message: 'Success', patient:patient});
});
// @type    PATCH
// @route   /api/secret/1
// @desc    route for user to update secret
// @access  PRIVATE
router.patch('/edit-details/', [auth], async (req, res)=> {
    let patient = req.patient;
    patient = new Patient(
        _.pick(req.body, ["firstName", "lastName", "phoneNo", "email", "dob", "email"])
    );

    Object.entries(patient).forEach(([key, value]) => {
        if (typeof value === 'undefined')   delete patient[key];
    });
    console.log(patient);
    const result = await Patient.findAndModify({id: req.patient.id}, patient);
    res.status(200).json({ok: true, message: "Data has been updated successfully!"});
});
module.exports = router;
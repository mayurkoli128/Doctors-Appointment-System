const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const MedicalHistory = require('../models/medicalHistory');
const {auth} = require('../middleware/auth');
const {adminAuth} = require('../middleware/adminAuth');
const multer = require('multer');
const _ = require('lodash');

// Multer storage engine
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

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
    const result = await Patient.findAndModify({id: req.patient.id}, patient);
    res.status(200).json({ok: true, message: "Data has been updated successfully!"});
});

// @type    GET
// @route   /api/secret/mine
// @desc    route for user to show his all secrets(page render)
// @access  PRIVATE 
router.get('/:id', [adminAuth], async (req, res)=> {
    const patient = await Patient.find({id: req.params.id}, ["email", "firstName", "lastName", "gender", "phoneNo", "dob"]);
    res.status(200).json({ok: true, message: 'Success', patient:patient});
});
// @type    GET
// @route   /api/secret/mine
// @desc    route for user to show his all secrets(page render)
// @access  PRIVATE 
router.get('/', [adminAuth], async (req, res)=> {
    const patients = await Patient.find({1: 1});
    res.status(200).json({ok: true, message: 'Success', patients:patients});
});
// @type    GET
// @route   /api/secret/mine
// @desc    route for user to show his all secrets(page render)
// @access  PRIVATE 
router.get('/medical-history/:id', [adminAuth], async (req, res)=> {
    const reports = await MedicalHistory.find({"MEDICAL_HISTORY.patientId": req.params.id}, ["MEDICAL_HISTORY.id", "MEDICAL_HISTORY.fileName", "MEDICAL_HISTORY.path", "APPOINTMENT.doctorId AS doctorId",  "APPOINTMENT.createdDate", "APPOINTMENT.startTime"]);
    res.status(200).json({ok: true, message: 'Success', reports:reports});
});
// @type    GET
// @route   /api/secret/mine
// @desc    route for user to show his all secrets(page render)
// @access  PRIVATE 
router.post('/medical-history/upload/:id', [adminAuth], async (req, res)=> {
    upload.single('patientReport')(req, res, async (err)=> {
        if (err) {
            return res.status(400).json({ok: false, message: err})
        }
        let report = _.pick(req.file, ['filename', 'path']);
        report.appointmentId = req.params.id;
        const appointments = (await Appointment.find({"APPOINTMENT.id": req.params.id}))[0];
        report.patientId = appointments.patientId;
        report = new MedicalHistory(report);
        await report.save();
        return res.status(200).json({ok: true, message: 'Report successfully uploaded.'})
    });
});
module.exports = router;
const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');
const {adminAuth} = require('../middleware/adminAuth');
const _ = require('lodash');

// @type    GET
// @route   /api/secret/mine
// @desc    route for user to show his all secrets(page render)
// @access  PRIVATE 
router.get('/', async (req, res)=> {
    const doctors = await Doctor.find({1: 1}, ["id", "firstName", "lastName", "gender", "qualification", "phoneNo", "specialization", "email", "intro", "avatar", "createdDate"]);
    res.status(200).json({ok: true, message: 'Success', doctors:doctors});
});

// @type    POST
// @route   /api/secret/mine
// @desc    route for user to add new secret
// @access  PRIVATE  
router.post('/add', [adminAuth], async(req, res)=> {
    const admin = req.admin;
    const doctor = new Doctor(
        _.pick(req.body.doctor, ["firstName", "lastName", "gender", "qualification", "phoneNo", "specialization", "email", "intro", "avatar"])
        );
    await doctor.save();
    res.status(201).json({ok: true, message: 'Inserted successfully!', doctor: doctor});
});
// @type    GET
// @route   /api/secret/:id
// @desc    route for user to show his secret with id=:id
// @access  PRIVATE 
router.get('/:doctorId', async (req, res)=> {
    let doctor = (await Doctor.find({id: req.params.doctorId}, ["firstName", "lastName", "gender", "qualification", "phoneNo", "specialization", "email", "intro", "avatar"]))[0];
    if (!doctor) {
        return res.status(404).json({ok: false, message:'Doctor not found.'});
    }
    res.status(200).json({ok: true, message: 'Found', doctor: doctor});
});

// @type    POST
// @route   /api/secret/mine
// @desc    route for user to add new secret
// @access  PRIVATE
router.delete('/:doctorId', [adminAuth], async(req, res)=> {
    const admin = req.admin;
    let doctor = (await Doctor.find({id: req.params.doctorId}, ["id"]))[0];
    if (!doctor) {
        return res.status(404).json({ok: false, message:'Record not found'});
    }
    await Doctor.delete({id: req.params.doctorId});
    res.status(200).json({ok: true, message: 'Deleted successfully!', doctor: doctor});
});

// @type    PATCH
// @route   /api/secret/1
// @desc    route for user to update secret
// @access  PRIVATE
router.patch('/:doctorId/', [adminAuth], async (req, res)=> {
    const user = req.user;
    let doctor = (await Doctor.find({id: req.params.doctorId}, ["id"]))[0];
    if (!doctor) {
        return res.status(404).json({ok: false, message:'Doctor not found.'});
    }
    doctor = new Doctor(
        _.pick(req.body, ["firstName", "lastName", "gender", "qualification", "phoneNo", "specialization", "email", "intro", "avatar"])
    );
    doctor.createdDate = new Date().toString();
    Object.entries(doctor).forEach(([key, value]) => {
        if (typeof value === 'undefined')   delete doctor[key];
    });
    const result = await Doctor.findAndModify({id: req.params.doctorId}, doctor);
    
    res.status(200).json({ok: true, message: "Data has been updated successfully!"});
});

module.exports = router;
const expres = require('express');
const router = expres.Router();
const Patient = require ('../models/patient');
const {auth} = require('../middleware/auth');
const Appointment = require('../models/appointment');
const _ = require('lodash');
const confirmationMail = require('../services/sendMail');

router.get('/', [auth], async (req, res)=> {
    const patient = req.patient;
    const appointments = await Appointment.find({patientId: patient.id});
    if (appointments.lenght == 0) {
    }
    res.status(201).json({ok: true, message: 'Appointment Fixed successfully!', appointments: appointments});
});

router.post('/:doctorId/book', [auth], async (req, res)=> {
    const patient = req.patient;
    const result = (await Appointment.find({doctorId: req.params.doctorId, startTime: req.body.startTime}, ["id", "startTime"]))[0];
    if (result) {
        return res.status(400).json({ok: false, message: "Appointment has already fixed"});
    }
    const appointment = new Appointment(
        _.pick(req.body, ["startTime", "endTime", "appointmentStatus"])
    );
    appointment.patientId = patient.id;
    appointment.doctorId = req.params.doctorId;
    appointment.appointmentStatus = "Confirm";
    appointment.save();
    // await confirmationMail();
    res.status(200).json({ok: true, message: 'Appointment Fixed successfully!', appointment: appointment});
});

router.get('/:doctorId/slots/', async (req, res)=> {
    const result = await Appointment.find({doctorId: req.params.doctorId}, ["id", "startTime"]);
    res.status(200).json({ok: true, message: 'Appointment Fixed successfully!', appointmentSlots: result});
});
module.exports = router;
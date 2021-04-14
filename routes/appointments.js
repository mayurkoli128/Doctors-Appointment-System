const expres = require('express');
const router = expres.Router();
const Doctor = require('../models/doctor');
const {auth} = require('../middleware/auth');
const {adminAuth} = require('../middleware/adminAuth');
const Appointment = require('../models/appointment');
const _ = require('lodash');
const confirmationMail = require('../services/sendMail');

router.get('/', [auth], async (req, res)=> {
    const patient = req.patient;
    const appointments = await Appointment.find({patientId: patient.id}, ["APPOINTMENT.id", "DOCTOR.firstName", "DOCTOR.lastName", "APPOINTMENT.appointmentStatus", "APPOINTMENT.createdDate", "APPOINTMENT.startTime", "DOCTOR.specialization"]);
    if (appointments.lenght == 0) {
        return res.status(400).json({ok: false, message: "No appointmets yet."});
    }
    res.status(201).json({ok: true, message: 'Success.', appointments: appointments});
});

router.post('/:doctorId/book', [auth], async (req, res)=> {
    const patient = req.patient;
    const result = (await Appointment.find({doctorId: req.params.doctorId, startTime: req.body.startTime}, ["APPOINTMENT.id", "startTime"]))[0];
    if (result) {
        return res.status(400).json({ok: false, message: "Selected slot has already booked by someone else, plase select any other empty slot."});
    }
    const appointment = new Appointment(
        _.pick(req.body, ["startTime", "endTime", "appointmentStatus"])
    );
    appointment.patientId = patient.id;
    appointment.doctorId = req.params.doctorId;
    appointment.appointmentStatus = "Confirm";
    appointment.save();
    patient.email = req.body.email;
    let doctor = (await Doctor.find({id: req.params.doctorId}, ["firstName", "lastName", "qualification"]))[0];
    await confirmationMail(doctor, patient, appointment);
    res.status(200).json({ok: true, message: 'Appointment Fixed successfully!', appointment: appointment});
});

router.get('/:doctorId/slots/', async (req, res)=> {
    const result = await Appointment.find({doctorId: req.params.doctorId}, ["APPOINTMENT.id", "startTime"]);
    res.status(200).json({ok: true, message: 'Appointment Fixed successfully!', appointmentSlots: result});
});

router.get('/all', [adminAuth], async (req, res)=> {
    const appointments = await Appointment.find({1:1}, ["APPOINTMENT.id AS appointmentID", "DOCTOR.id AS doctorsID", "DOCTOR.firstName AS doctorsFirstName", "DOCTOR.lastName AS doctorsLastName", "DOCTOR.specialization", "APPOINTMENT.appointmentStatus", "APPOINTMENT.createdDate", "APPOINTMENT.startTime", "PATIENT.id AS patientsID", "PATIENT.firstName AS patientsFirstName", "PATIENT.lastName AS patientsLastName"]);
    if (appointments.lenght == 0) {
        return res.status(400).json({ok: false, message: "No appointmets yet."});
    }
    res.status(201).json({ok: true, message: 'Success.', appointments: appointments});
});
module.exports = router;
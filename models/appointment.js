const connection = require('../startup/db');
require('dotenv').config();

class Appointment {
    constructor(appointment) {
        this.patientId = appointment.patientId;
        this.doctorId = appointment.doctorId;
        this.appointmentStatus = appointment.appointmentStatus;
        this.startTime = appointment.startTime;
        this.endTime = appointment.endTime;
        this.createdDate = new Date().toString();
    }
    save = ()=>{
        return new Promise((resolve, reject)=> {
            const query = `INSERT INTO APPOINTMENT SET ?`
            connection.query(query, this, (err, result)=> {
                if (err)    reject(err);
                resolve (result);
            });
        });
    }
}
Appointment.find = (filters, columns=["*"])=> {
    return new Promise((resolve, reject)=>{
        let query=`SELECT ${columns.join(', ')} FROM APPOINTMENT JOIN PATIENT ON APPOINTMENT.patientId = PATIENT.id JOIN DOCTOR ON APPOINTMENT.doctorId = DOCTOR.id WHERE `;
        if (filters && typeof filters == 'object') {
            query += Object.keys(filters).map(function (key) {
                return encodeURIComponent(key) + '="' + (filters[key]) + '"';
            }).join('&&');
        }
        connection.query(query, (err, result)=>{
            if (err)    reject(err);
            else resolve(result);
        });
    });
}
Appointment.findAndModify = (filters, changes)=> {
    return new Promise((resolve, reject)=>{
        let query=`UPDATE APPOINTMENT SET ? WHERE `;
        if (filters && typeof filters == 'object') {
            query += Object.keys(filters).map(function (key) {
                return encodeURIComponent(key) + '="' + (filters[key]) + '"';
            }).join('&&');
        }
        connection.query(query, changes, (err, result)=>{
            if (err)    reject(err);
            else resolve(result);
        });
    });
}
module.exports = Appointment;
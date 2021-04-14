const connection = require('../startup/db');
require('dotenv').config();

class MedicalHistory {
    constructor(medicalHistory) {
        this.fileName = medicalHistory.filename;
        this.path = medicalHistory.path;
        this.appointmentId = medicalHistory.appointmentId;
        this.patientId = medicalHistory.patientId;
    }
    save = ()=>{
        return new Promise((resolve, reject)=> {
            const query = `INSERT INTO MEDICAL_HISTORY SET ?`
            connection.query(query, this, (err, result)=> {
                if (err)    reject(err);
                resolve (result);
            });
        });
    }
}
MedicalHistory.find = (filters, columns=["*"])=> {
    return new Promise((resolve, reject)=>{
        let query=`SELECT ${columns.join(', ')} FROM MEDICAL_HISTORY JOIN APPOINTMENT ON MEDICAL_HISTORY.appointmentId = APPOINTMENT.id JOIN PATIENT ON MEDICAL_HISTORY.patientId = PATIENT.id WHERE `;
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
MedicalHistory.findAndModify = (filters, changes)=> {
    return new Promise((resolve, reject)=>{
        let query=`UPDATE MEDICAL_HISTORY SET ? WHERE `;
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
module.exports = MedicalHistory;
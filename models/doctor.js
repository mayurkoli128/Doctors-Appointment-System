const Joi = require('joi');
const connection = require('../startup/db');

class Doctor {
    constructor(doctor) {
        this.firstName = doctor.firstName,
		this.lastName = doctor.lastName,
		this.gender = doctor.gender,
		this.qualification = doctor.qualification,
		this.phoneNo = doctor.phoneNo,
		this.specialization = doctor.specialization,
		this.email = doctor.email,
		this.intro = doctor.intro,
        this.avatar = doctor.avatar,
        this.createdDate = new Date().toString();
    }
    save = ()=>{
        return new Promise((resolve, reject)=> {
            const query = `INSERT INTO DOCTOR SET ?`
            connection.query(query, this, (err, result)=> {
                if (err)    reject(err);
                resolve (result);
            });
        });
    }
}
Doctor.find = (filters, columns=["*"])=> {
    return new Promise((resolve, reject)=>{
        let query=`SELECT ${columns.join(', ')} FROM DOCTOR WHERE `;
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
Doctor.findAndModify = (filters, changes)=> {
    return new Promise((resolve, reject)=>{
        let query=`UPDATE DOCTOR SET ? WHERE `;
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
Doctor.delete = (filters)=> {
    return new Promise((resolve, reject)=>{
        let query=`DELETE FROM DOCTOR WHERE `;
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
Doctor.validate = (user)=>{
    const schema = {
        avatar: Joi.string().min(6).max(10).required(),
    };
    return Joi.validate(user, schema);
}
module.exports = Doctor;
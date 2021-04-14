const connection = require('../startup/db');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class User {
    constructor(patient) {
        this.email = patient.email;
        this.password = patient.password;
        this.firstName = patient.firstName;
        this.lastName = patient.lastName;
        this.dob = patient.dob;
        this.phoneNo = patient.phoneNo;
        this.gender = patient.gender;
        this.createdDate = new Date().toString();
    }
    save = ()=>{
        return new Promise((resolve, reject)=> {
            const query = `INSERT INTO PATIENT SET ?`
            connection.query(query, this, (err, result)=> {
                if (err)    reject(err);
                resolve (result);
            });
        });
    }
    generateAuthToken = (isAdmin=false)=> {
        const expiresIn = 60 * 60 * 240; // an hour
        let token = jwt.sign({
            email: this.email,
            isAdmin: isAdmin,
        }, process.env.JWT_PRIVATE_TOKEN || "UNSECURED_JWT_PRIVATE_TOKEN", {expiresIn: expiresIn});
        return token;
    }
}
User.find = (filters, columns=["*"])=> {
    return new Promise((resolve, reject)=>{
        let query=`SELECT ${columns.join(', ')} FROM PATIENT WHERE `, len = Object.keys(filters).length;
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
User.findAndModify = (filters, changes)=> {
    return new Promise((resolve, reject)=>{
        let query=`UPDATE PATIENT SET ? WHERE `;
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
User.validate = (patient)=>{
    const schema = {
        email: Joi.string().min(3).max(255).required(),
        firstName: Joi.string().required().max(1040),
        lastName: Joi.string().required().max(4400),
        password: Joi.string().min(1).max(255).required(),
        confirmPassword : Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
        gender: Joi.string().required().max(10),
        dob: Joi.string().required().max(30),
        phoneNo: Joi.string().required().max(13),
    };
    return Joi.validate(patient, schema);
}
module.exports = User;
const connection = require('../startup/db');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class Admin {
    constructor(admin) {
        this.username = admin.username;
        this.password = admin.password;
        this.createdDate = new Date().toString();
			
    }
    save = ()=>{
        return new Promise((resolve, reject)=> {
            const query = `INSERT INTO ADMIN SET ?`
            connection.query(query, this, (err, result)=> {
                if (err)    reject(err);
                resolve (result);
            });
        });
    }
    generateAuthToken = ( isAdmin=false, is2faAuthenticated=false)=> {
        const expiresIn = 60 * 60 * 240; // an hour
        let token = jwt.sign({
            username: this.username,
            isAdmin: isAdmin,
            is2faAuthenticated: is2faAuthenticated
        }, process.env.JWT_PRIVATE_TOKEN || "UNSECURED_JWT_PRIVATE_TOKEN", {expiresIn: expiresIn});
        return token;
    }
}
Admin.find = (filters, columns=["*"])=> {
    return new Promise((resolve, reject)=>{
        let query=`SELECT ${columns.join(', ')} FROM ADMIN WHERE `, len = Object.keys(filters).length;
        if (filters && typeof filters == 'object') {
            query += Object.keys(filters).map(function (key) {
                return encodeURIComponent(key) + '="' + (filters[key]) + '"';
            }).join('&&');
        }
        connection.query(query, (err, result)=>{
            if (err)    reject(err);
            else resolve(result[0]);
        });
    });
}
Admin.findAndModify = (filters, changes)=> {
    return new Promise((resolve, reject)=>{
        let query=`UPDATE ADMIN SET ? WHERE `;
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
Admin.validate = (admin)=>{
    const schema = {
        username: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(1).max(255).required(),
    };
    return Joi.validate(admin, schema);
}
module.exports = Admin;
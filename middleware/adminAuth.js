const jwt = require('jsonwebtoken');
const AdminSetting = require('../models/adminSetting');
const Admin = require('../models/admin');
require('dotenv').config();

// if user trying to get private routes authenticate the route first then allow user to enter in
module.exports.adminAuth = async function(req, res, next, omitSecondFactor=false) {
    token = req.cookies.auth_token;
    if(!token) {
        return res.status(401).json({ok: false, message: 'Unauthorized'});
    }
    try {
        const {username, is2faAuthenticated, isAdmin} = jwt.verify(token, process.env.JWT_PRIVATE_TOKEN||"UNSECURED_JWT_PRIVATE_TOKEN");
        const admin = await Admin.find({username: username}, ["id", "username"]);
        if (!admin || !isAdmin) {
            return res.status(401).json({ok: false, message: 'Sorry, you are not allowed to access this page'});
        }
        const twofaSetting = (await AdminSetting.find({adminId: admin.id, name: "2fa"}))[0];
        if (!omitSecondFactor && twofaSetting && !is2faAuthenticated) {
            return res.status(206).json({ok: false, message: 'Unauthorized'});
        } 
        req.admin = admin;
        return next();
    } catch (error) {
        return next(error);
    }
}
// if token is valid and user trying to login or register render user to dashboard directly...
module.exports.adminForwardAuthenticate = async function(req, res, next) {
    token = req.cookies.auth_token;
    if(!token) {
        return next();
    }
    try {
        const {username, is2faAuthenticated, isAdmin} = jwt.verify(token, process.env.JWT_PRIVATE_TOKEN || "UNSECURED_JWT_PRIVATE_TOKEN");
        const admin = await Admin.find({username: username});

        if (!admin || !isAdmin) {
            return next();
        }
        const twofaSetting = (await AdminSetting.find({adminId: admin.id, name: "2fa"}))[0];
        if (twofaSetting && !is2faAuthenticated) {
            return next();
        } 
        req.admin = admin;
        return res.status(206).redirect('../adminDashboard');
    } catch (error) {
        return next(error);
    }
}

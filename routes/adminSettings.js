const express = require('express');
const router = express.Router();
const {adminAuth} = require('../middleware/adminAuth');
const AdminSetting = require('../models/adminSetting');
const Admin = require('../models/admin');
const _ = require('lodash');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const bcrypt = require('bcryptjs');

// @type    POST
// @route   /api/settings/
// @desc    route for admin to store setting 
// @access  PRIVATE 
router.post('/', [adminAuth], async(req, res)=> {
    const admin = req.admin;
    if (!req.body) {
        return res.status(400).json({ok: false, message: 'Bad request'});
    }
    let setting = new AdminSetting(_.pick(req.body, ["name", "type", "valueInt", "valueStr"]));
    setting.adminId = admin.id;
    await setting.save();
    res.status(200).json({ok: true, message: "Inserted"});
});

// @type    GTE
// @route   /api/settings/
// @desc    route for admin to get all his/her settings
// @access  PRIVATE 
router.get('/', [adminAuth], async(req, res)=> {
    const admin = req.admin;
    const result = await AdminSetting.find({adminId: admin.id});
    res.status(200).json({ok: true, message: "", settings: result});
});

// @type    GET
// @route   /api/settings/2fa/generate
// @desc    route for admin to get secrets & qrcode for activation of 2fa
// @access  PRIVATE 
router.get('/2fa/generate', [adminAuth], async(req, res)=> {
    const secret = speakeasy.generateSecret({
        name: "City Hospital"
    });
    let qrcode_img = await qrcode.toDataURL(secret.otpauth_url);
    res.status(200).json({ok: true, message: "Success", qrcode: qrcode_img, base32secret: secret.base32});
});

// @type    POST
// @route   /api/settings/2fa/verify
// @desc    route for admin to verify provided token value
// @access  PRIVATE 
router.post('/2fa/verify', [adminAuth], async(req, res)=> {
    const admin = req.admin;
    if (!req.body) {
        return res.status(400).json({ok: false, message: 'Bad request'});
    }
    let verified = speakeasy.totp.verify({ secret: req.body.valueStr,
        encoding: 'base32',
        token: req.body.adminToken });

    if (!verified) {
        return res.status(403).json({ok: false, message: "Syncronization failed"});
    }
    // save base32 secret in db & send qrcode, currently we are storing secret in plain text (bad practice)
    let setting = new AdminSetting(_.pick(req.body, ["name", "type", "valueInt", "valueStr"]));
    setting.adminId = admin.id;
    await setting.save();
    let maxAge = 60*60;
    let token = new Admin(admin).generateAuthToken(true, true);
    res.cookie('auth_token', token, {httpOnly: true, maxAge: 1000*maxAge});
    res.status(200).json({ok: true, message: "Success"});
});

// @type    GET
// @route   /api/settings/2fa/authenticate
// @desc    route for user to authenticate provided token value
// @access  PRIVATE 
router.get('/2fa/authenticate', async(req, res, next)=>{await adminAuth(req, res, next, true)}, (req, res)=> {
    res.status(206).render('2fa');
});

// @type    POST
// @route   /api/settings/2fa/authenticate
// @desc    route for user to authenticate provided token value
// @access  PRIVATE 
router.post('/2fa/authenticate', async(req, res, next)=>{await adminAuth(req, res, next, true)}, async(req, res)=> {
    const admin = req.admin;
    const secret = (await AdminSetting.find({adminId: admin.id, name: "2fa"}))[0];
    if (!req.body) {
        return res.status(400).json({ok: false, message: 'Bad request'});
    }
    let verified = speakeasy.totp.verify({ secret: secret.valueStr,
        encoding: 'base32',
        token: req.body.adminToken });

    if (!verified) {
        return res.status(403).render("2fa", {err: "Syncronization failed"});
    }
    let maxAge = 60*60;
    let token = new Admin(admin).generateAuthToken(true, true);
    res.cookie('auth_token', token, {httpOnly: true, maxAge: 1000*maxAge});
    res.status(200).redirect('../../adminDashboard');
});

// @type    DELETE
// @route   /api/settings/2fa/
// @desc    route for user to deactivate users setting
// @access  PRIVATE 
router.delete('/2fa/:setting', [adminAuth], async (req, res)=> {
    const admin = req.admin;
    let result = await AdminSetting.find({name: req.params.setting, adminId: admin.id});
    if (!result[0]) {
        return res.status(400).json({ok: false, message: '2fa has not activated'});
    }
    await AdminSetting.delete({name: req.params.setting, adminId: admin.id});
    res.status(200).json({ok: true, message: 'Unset', result: result});
});

// @type    PATCH
// @route   /api/users/edit-account/password
// @desc    route for user to change password
// @access  PRIVATE 
router.patch('/edit-account/password', [adminAuth], async(req, res)=> {
    let admin = req.admin;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    await Admin.findAndModify({id: admin.id}, {password: password});
    res.status(200).json({ok: true, message: 'Password reset successfully.'});;
});
module.exports = router;
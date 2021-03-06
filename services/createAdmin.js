const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

module.exports = async function createAdmin(body) {
    const {error} = Admin.validate(body);
    if (error) {
        throw new Error(error.details[0].message);
    }
    // make sure that username is unique..
    let admin = await Admin.find({username: body.username});
    
    if(admin) {
        return ;
    }
    //if valid create admin object.
    admin = new Admin(_.pick(body, ["username", "password"]));
    //create hash of password.
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    //insert into database
    await admin.save();
}
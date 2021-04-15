const nodemailer = require("nodemailer");
require('dotenv').config();

module.exports = async function sendReports (doctor, patient, reports) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
        },
    });
    let patientReports = [];
    for (let i = 0; i < reports.length; i++) {
        patientReports.push({
            filename: reports[i].fileName,
            path: './'+reports[i].path,
            contentType: 'application/pdf'
        });
    }    
    // send mail with defined transport object
    return transporter.sendMail({
        from: `"XYZ Hospital" <${process.env.EMAIL}>`, // sender address
        to: doctor.email, // list of receivers
        subject: "PATIENT REPORT", // Subject line
        text: "Hello world?", // plain text body
        attachments: patientReports,
        html: `<strong>Dear ${doctor.firstName+' '+doctor.lastName}</strong><br><br>Medical History of  ${patient.firstName+' '+patient.lastName}. <br><br>
        `, // html body
    });
}

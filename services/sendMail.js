const nodemailer = require("nodemailer");
require('dotenv').config();

module.exports = async function confirmationMail(doctor, patient, appointment) {
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
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"XYZ Hospital" <${process.env.EMAIL}>`, // sender address
        to: patient.email, // list of receivers
        subject: "APPOINTMENT STATUS", // Subject line
        text: "Hello world?", // plain text body
        html: `<strong>Dear ${patient.firstName+' '+patient.lastName}</strong><br><br>Your appointment has booked successfully with ${doctor.firstName+' '+doctor.lastName} ,${doctor.qualification} at ${appointment.startTime}.<br><br>
        <h1>Our Address</h1>

        <address>
            Visit us at:<br>
            Example.com<br>
            Box 564, Disneyland<br>
            Contact us at <a href="#" style="cursor: pointer;">hello@xyzHospital.com</a>.<br> 
        </address>
        <br>Thanks You,`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

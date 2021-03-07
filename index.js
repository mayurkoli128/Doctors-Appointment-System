const express = require('express');
const app = express();
const error = require('./middleware/error');
const flash=require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const createAdmin = require('./services/createAdmin');
const home = require('./routes/home');
const join = require('./routes/join');
const doctors = require('./routes/doctors');
const patients = require('./routes/patients');
const appointments = require('./routes/appointments');
const settings = require('./routes/adminSettings');

require('dotenv').config();
// flash messaging...
app.use(cookieParser('keyboard cat'));
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }}
));
app.use(flash());

//standard middleware for parsing json request
app.use(express.json());

//form data parsing
app.use(express.urlencoded({extended:false}));

// rendering public static files
app.use('/', express.static('public'));
app.use('/', express.static('public'));
app.use('/', express.static('API'));

//set view engine ejs
app.set('view engine', 'ejs');

// routes...
app.use('/', home);
app.use('/doctors/', doctors);
app.use('/patients/', patients);
app.use('/join/', join);
app.use('/settings/', settings);
app.use('/appointments/', appointments);
app.use(error);

// create dummy admin...
createAdmin({username: "admin", password: "admin"});
app.listen(8080, ()=> {
    console.log('Listening at 8080');
});

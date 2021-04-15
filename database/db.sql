CREATE DATABASE AppointmentSys;

USE AppointmentSys;

CREATE TABLE PATIENT (
    id	int8 AUTO_INCREMENT,
	firstName	VARCHAR(255) NOT NULL,
	lastName	VARCHAR(255) NOT NULL,
	dob	VARCHAR(255) NOT NULL,
	gender	VARCHAR(10) NOT NULL, 
	phoneNo	VARCHAR(13) UNIQUE NOT NULL,
	email	VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(1024) NOT NULL, 
	avatar VARCHAR(8) ,
	createdDate VARCHAR(255) not null,
    PRIMARY KEY(id)
);
DESCRIBE PATIENT;

CREATE TABLE DOCTOR (
    id	int8 AUTO_INCREMENT, 
	firstName	varchar(255) NOT NULL,
	lastName	varchar(255) NOT NULL,
	gender	VARCHAR(10) NOT NULL,
	qualification	varchar(50) NOT NULL,
	phoneNo	varchar(13) NOT NULL,
	specialization	VARCHAR(1024) NOT NULL,
	email	varchar(255) UNIQUE NOT NULL,
	avatar VARCHAR(8),
	intro VARCHAR(1024),
	createdDate VARCHAR(255) not null,
    PRIMARY KEY(id)
);
DESCRIBE DOCTOR;

CREATE TABLE DOCTOR_AVAILABILITY (
    id	int8 AUTO_INCREMENT,
	doctorId	int8 NOT NULL,
	daysOfWeek	varchar(1024) NOT NULL,
	startTime	VARCHAR(1024) NOT NULL,
	endTime	VARCHAR(1024) NOT NULL,
	isAvailable	INT8 NOT NULL,
	reasonOfUnavailability VARCHAR(1024),
    PRIMARY KEY(id),
    FOREIGN KEY(doctorId) REFERENCES DOCTOR(id)
);
DESCRIBE DOCTOR_AVAILABILITY;

CREATE TABLE PATIENT_REVIEW (
	patientId	int8,
	doctorId	int8,
	overallRatings	int8,
	review	varchar(1000),
	reviewDate	date,
    PRIMARY KEY(patientId, doctorId),
    FOREIGN KEY(doctorId) REFERENCES DOCTOR(id),
    FOREIGN KEY(patientId) REFERENCES PATIENT(id)
);
DESCRIBE PATIENT_REVIEW;

CREATE TABLE APPOINTMENT (
    id	int8 AUTO_INCREMENT,
	patientId	int8 NOT NULL,
	doctorId	int8 NOT NULL,
	appointmentStatus VARCHAR(566),
	createdDate VARCHAR(255) not null,
	startTime	VARCHAR(566),
	endTime	VARCHAR(566),
    PRIMARY KEY(id),
    FOREIGN KEY(doctorId) REFERENCES DOCTOR(id),
    FOREIGN KEY(patientId) REFERENCES PATIENT(id)
);
DESCRIBE APPOINTMENT;

CREATE TABLE MEDICAL_HISTORY (
    id	int8 AUTO_INCREMENT,
	fileName VARCHAR(566) UNIQUE not null,
	path VARCHAR(255) not null,
	appointmentId	int8 NOT NULL,
	patientId int8 NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(appointmentId) REFERENCES APPOINTMENT(id),
    FOREIGN KEY(patientId) REFERENCES PATIENT(id)
);
DESCRIBE MEDICAL_HISTORY;

CREATE TABLE ADMIN (
    id	int8 AUTO_INCREMENT,
	username	VARCHAR(255) NOT NULL,
    password VARCHAR(1024) NOT NULL, 
	createdDate VARCHAR(255) not null,
    PRIMARY KEY(id)
);
DESCRIBE ADMIN;

CREATE TABLE ADMIN_SETTINGS
(
    name VARCHAR(255),
    adminId int8,
    type bool,
    valueInt int8 NULL,
    valueStr VARCHAR(255) NULL,
    PRIMARY KEY(name, adminId),
    FOREIGN key(adminId) REFERENCES ADMIN(id),
    lastModified VARCHAR(255) not null
);

DESCRIBE ADMIN_SETTINGS;
** CLEAR DATABASE **

set sql_safe_updates  = false;
delete from MEDICAL_HISTORY;
DELETE FROM PATIENT_REVIEW;
DELETE FROM APPOINTMENT;
delete from PATIENT;
DELETE FROM ADMIN_SETTINGS;
DELETE FROM ADMIN;
DELETE FROM DOCTOR_AVAILABILITY;
DELETE FROM DOCTOR;

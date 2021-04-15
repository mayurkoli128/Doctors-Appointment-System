import {makeRequest} from '../API/xhr.js';

const db = window.location.origin;

export async function retrieveAdmin(username) {
    const {user, friend} = (await makeRequest({method: "GET", url: `${db}/user/${username}`})).response;
    return {user, friend};
}
export function deleteDoctor(doctorId) {
    return makeRequest({method: "DELETE", url: `${db}/doctors/${doctorId}`});
}
export async function getDoctorDetails(doctorId) {
    const {admin, doctor} = (await makeRequest({method: "GET", url: `${db}/doctors/${doctorId}`})).response;
    return {doctor, admin};
}
export async function getPatientDetails() {
    const {patient} = (await makeRequest({method: "GET", url: `${db}/patients/me`})).response;
    return {patient};
}
export async function getPatientDetailsByID(id) {
    const {patient} = (await makeRequest({method: "GET", url: `${db}/patients/${id}`})).response;
    return {patient};
}

export async function getAllDoctors() {
    const {doctors} = (await makeRequest({method: "GET", url: `${db}/doctors/`})).response;
    return {doctors};
}
export async function getAllPatients() {
    const {patients} = (await makeRequest({method: "GET", url: `${db}/patients/`})).response;
    return {patients};
}
export async function addDoctor(doctor) {
    // username, publicKey...
    const data = {
        firstName: doctor.firstName,
		lastName: doctor.lastName,
		gender: doctor.gender,
		qualification: doctor.qualification,
		phoneNo: doctor.phoneNo,
		specialization: doctor.specialization,
		email: doctor.email,
		intro: doctor.intro,
        avatar: doctor.avatar,
    }
    return makeRequest({method: "POST", url: `${db}/doctors/add`, headers: {"Content-Type": "application/json;charset=UTF-8"}, data: {doctor: data}});
}
export async function updateDoctorDetails(doctor, doctorId) {
    // username, publicKey...
    doctorId=doctorId.trim();
    const data = {
        firstName: doctor.firstName,
		lastName: doctor.lastName,
		gender: doctor.gender,
		qualification: doctor.qualification,
		phoneNo: doctor.phoneNo,
		specialization: doctor.specialization,
		email: doctor.email,
		intro: doctor.intro
    }
    return makeRequest({method: "PATCH", url: `${db}/doctors/${doctorId}/`, headers: {"Content-Type": "application/json;charset=UTF-8"}, data: data});
}
export async function  myMedicalHistory() {
    const {reports} = (await makeRequest({method: "GET", url: `${db}/patients/medical-history/mine/`})).response;
    return {reports};
}
export async function updatePatientDetails(patient) {
    // username, publicKey...
    const data = {
        firstName: patient.firstName,
		lastName: patient.lastName,
		gender: patient.gender,
		phoneNo: patient.phoneNo,
		email: patient.email,
    }
    return makeRequest({method: "PATCH", url: `${db}/patients/edit-details/`, headers: {"Content-Type": "application/json;charset=UTF-8"}, data: data});
}
export async function changePassword(password) {
    return makeRequest({method: "PATCH", url: `${db}/settings/edit-account/password`, headers: {"Content-Type": "application/json;charset=UTF-8"}, data: {password: password}});
}

export async function bookSlot(slot, doctorId, email) {
    return makeRequest({method: "POST", url: `${db}/appointments/${doctorId}/book/`, headers: {"Content-Type": "application/json;charset=UTF-8"}, data: {startTime: slot, endTime: slot, email: email}});
}
export async function uploadMedicalReport(formData, appointmentID) {
    let url = `${db}/patients/medical-history/upload/${appointmentID}/` ;
    return new Promise((resolve, reject)=> {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onreadystatechange = ()=> {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                  // The request has been completed successfully
                  resolve({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: JSON.parse(xhr.responseText)
                      });
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: JSON.parse(xhr.responseText)
                    });
                }
            }
        };
        xhr.onerror=()=>{
            reject({
                status: xhr.status,
                statusText: xhr.statusText,
                response: JSON.parse(xhr.responseText)
            });
        };
        xhr.send(formData);
    }); 
}
export async function getMedicalReports(patientId) {
    const res = await makeRequest({method: "GET", url: `${db}/patients/medical-history/${patientId}`});

    return {reports: res.response.reports};
}
export async function sendReports(from, to) {
    const res = await makeRequest({method: "GET", url: `${db}/patients/medical-history/send/${from}/${to}/`});

    return res;
}
export async function getAllBookedSlots(doctorId) {
    const res = await makeRequest({method: "GET", url: `${db}/appointments/${doctorId}/slots/`});

    return {allSlots: res.response.appointmentSlots};
}
export async function getAllAppointments() {
    const {appointments} = (await makeRequest({method: "GET", url: `${db}/appointments/all/`})).response;
    return {appointments};
}
export async function myAppointments() {
    const res = await makeRequest({method: "GET", url: `${db}/appointments/`});

    return {appointments: res.response.appointments};
}
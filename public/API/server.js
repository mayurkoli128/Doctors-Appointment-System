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
export async function getAllDoctors() {
    const {doctors} = (await makeRequest({method: "GET", url: `${db}/doctors/`})).response;
    return {doctors};
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
export async function changePassword(password) {
    return makeRequest({method: "PATCH", url: `${db}/settings/edit-account/password`, headers: {"Content-Type": "application/json;charset=UTF-8"}, data: {password: password}});
}

export async function bookSlot(slot, doctorId) {
    return makeRequest({method: "POST", url: `${db}/appointments/${doctorId}/book/`, headers: {"Content-Type": "application/json;charset=UTF-8"}, data: {startTime: slot, endTime: slot}});
}
export async function getAllBookedSlots(doctorId) {
    const res = await makeRequest({method: "GET", url: `${db}/appointments/${doctorId}/slots/`});

    return {allSlots: res.response.appointmentSlots};
}
export async function myAppointments() {
    const res = await makeRequest({method: "GET", url: `${db}/appointments/`});

    return {appointments: res.response.appointments};
}
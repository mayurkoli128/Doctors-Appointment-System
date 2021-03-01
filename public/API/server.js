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
    const {doctors, admin} = (await makeRequest({method: "GET", url: `${db}/doctors/`})).response;
    return {doctors, admin};
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

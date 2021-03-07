import { 
    getDoctorDetails,
	getAllDoctors,
	bookSlot,
	getAllBookedSlots,
	myAppointments,
} from '../API/server.js';
import {show} from '../partials/messages.js';

// finally book it.
let slot;
const confirmEmail = document.getElementById('confirm-email');
confirmEmail.addEventListener('submit', async (event)=> {
	event.preventDefault();
	const doctorId = document.getElementById('record-id').getAttribute('data-content');
	console.log(doctorId);
	try {
		const res = await bookSlot(slot, doctorId);
		bookingModal(doctorId);
		show('You will receive an email confirmation shortly.', "success", "confirm-booking-msg");
	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "confirm-booking-msg");
		console.log(error);
	}
});
// when user click on any slot....
window.confirmSlot = async function(par) {
	try {
		slot = par;
		const doctorId = document.getElementById('record-id').getAttribute('data-content');
		const {doctor} = await getDoctorDetails(doctorId);
		document.getElementById('dateTime').innerText = getTime()+' At '+par;
		document.getElementById('doctor-name').innerText = doctor.firstName+' '+doctor.lastName;
		document.getElementById('doctor-education').innerText = doctor.qualification;
		document.getElementById('doctor-specialization').innerText = doctor.specialization;
		document.getElementById('confirm-patient-email').value = document.getElementById('username').innerText.substr(10);
		$('#confirm-slot').modal('show');
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}
// first show the slots modal
window.bookingModal = async function(id) {
	document.getElementById('record-id').setAttribute("data-content", id);
	try {
		const {allSlots} = await getAllBookedSlots(id);
		let all = ["12:00 PM", "06:00 PM", "06:30 PM", "10:00 AM", "06:15 PM", "08:00 PM", "01:30 PM", "10:15 AM", "12:15 PM", "08:15 PM", "08:30 PM", "10:45 PM", "12:30 PM", "10:30 AM", "07:00 PM", "12:45 PM", "10:45 AM", "11:00 AM", "01:00 PM", "01:15 PM", "07:15 PM", "11:15 AM", "11:30 AM"];
		for (let i=0; i<all.length; ++i) {
			document.getElementById(all[i]).style.backgroundColor="white";
		}
		for (let i=0; i<allSlots.length; ++i) {
			document.getElementById(allSlots[i].startTime).style.backgroundColor="red";
		}
		$('#appointment-slots').modal('show');
		
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}
window.viewDoctors = async function() {
	try {
		let {doctors} = await getAllDoctors();
		let all = "";
		for (let i = 0; i < doctors.length; i++) {
			let logo = doctors[i].firstName[0]+doctors[i].firstName[1];
			logo = logo.toUpperCase();
			all += `<tr>
			<th scope="row"><span class="profile-logo" style="background-color: ${doctors[i].avatar}"> ${logo}</span></th>
			<th>
				${doctors[i].firstName}
				<span> (${doctors[i].qualification})</span>
			</th>
			<th>
				${doctors[i].specialization}
			</th>
			<th></th>
			<th><button type="button"  id="${doctors[i].id}" class="btn btn-info" onclick="bookingModal(this.id)">Book an appointment</button></th>
		</tr>`;
		}
		
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
};
window.myAppointment = async function() {
	try {
		let {appointments} = await myAppointments();
		let all = "";
		for (let i = 0; i < appointments.length; i++) {
			let logo = appointments[i].firstName[0]+appointments[i].firstName[1];
			logo = logo.toUpperCase();
			all += `<tr>
			<th scope="row"><span class="profile-logo" style="background-color: ${appointments[i].avatar}"> ${logo}</span></th>
			<th>
				${appointments[i].firstName}
				<span> (${appointments[i].qualification})</span>
			</th>
			<th>
				${appointments[i].specialization}
			</th>
			<th></th>
			<th><button type="button"  id="${appointments[i].id}" class="btn btn-info" onclick="bookingModal(this.id)">Book an appointment</button></th>
		</tr>`;
		}
		
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}
viewDoctors();
function getTime() {
	var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
	return utc;
}	
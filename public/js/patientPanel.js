import { 
    getDoctorDetails,
	getAllDoctors,
	bookSlot,
	getAllBookedSlots,
	myAppointments,
	getPatientDetails,
	updatePatientDetails,
	myMedicalHistory
} from '../API/server.js';
import {show} from '../partials/messages.js';

// finally book it.
let slot;
const confirmEmail = document.getElementById('confirm-email');
confirmEmail.addEventListener('submit', async (event)=> {
	event.preventDefault();
	const doctorId = document.getElementById('record-id').getAttribute('data-content');
	const email = confirmEmail.elements[0].value;
	
	try {
		const res = await bookSlot(slot, doctorId, email);
		bookingModal(doctorId);
		show('You will receive an email confirmation shortly.', "success", "confirm-booking-msg");
	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "confirm-booking-msg");
		console.log(error);
	}
});
// view my appointment...
window.myMedicalHistory = async function() {
	try {
		const {reports} = await myMedicalHistory();
		let all = "";
		for (let i = 0; i < reports.length; i++) {
			all += `<tr class="table-row">
                <td>${reports[i].doctor.firstName + " "+ reports[i].doctor.lastName }</td>
                <td>${reports[i].doctor.qualification}</td>
                <td>${reports[i].doctor.email}</td>
                <td>${reports[i].createdDate}</td>
                <td><a href="uploads/${reports[i].fileName}" class="btn btn-info" target="_blank">click here</a>
			</tr>`;
		}
		document.getElementById('col-names').innerHTML = `<tr>
					<th scope="col">DOCTOR NAME</th>
					<th scope="col">DOCTOR QUALIFICATION</th>
					<th scope="col">DOCTOR EMAIL</th>
					<th scope="col">DATE OF APPOINTMENT</th>
					<th scope="col">VIEW REPORT</th>
				</tr>`;
		document.getElementById('main-dashboard-head').innerHTML = `<span class="material-icons" style="vertical-align: bottom; font-size: 25px;">
		history
		</span> Medical history`;
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;

	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "confirm-booking-msg");
		console.log(error);
	}
}
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
			document.getElementById(all[i]).style.color="black"
		}
		for (let i=0; i<allSlots.length; ++i) {
			document.getElementById(allSlots[i].startTime).style.backgroundColor="#dc3545";
			document.getElementById(allSlots[i].startTime).style.color="white"
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
			<td scope="row"><span class="profile-logo" style="background-color: ${doctors[i].avatar}"> ${logo}</span></td>
			<td>
				${doctors[i].firstName}
				<span> (${doctors[i].qualification})</span>
			</td>
			<td>
				${doctors[i].specialization}
			</td>
			<td></td>
			<td><button type="button"  id="${doctors[i].id}" class="btn btn-info" onclick="bookingModal(this.id)">Book an appointment</button></td>
		</tr>`;
		}
		document.getElementById('col-names').innerHTML = `<tr>
					<th scope="col"></th>
					<th scope="col">DOCTOR NAME</th>
					<th scope="col">SPECIALIZATION</th>
					<th scope="col"></th>
				</tr>`;
		document.getElementById('main-dashboard-head').innerHTML = `<span class="material-icons" style="vertical-align: bottom; font-size: 25px;">
		person
		</span> My Appointments`;
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
};

window.editPatientDetails = async function() {
	const patient = {
		firstName: document.getElementById('firstName').value,
		lastName: document.getElementById('lastName').value,
		phoneNo: document.getElementById('phoneNo').value,
		email: document.getElementById('email').value,
		dob: document.getElementById('dob').value,
	};
	try {
		let res = await updatePatientDetails(patient);
		if (res.response.ok) {
			show(res.response.message, "success", "edit-patient-msg");
		} else {
			show("Something failed.", "danger", "edit-patient-msg");
		}
	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "edit-patient-msg");
		console.log(error);
	}
}
window.editPatientDetailsForm = async function() {
	try {
		let {patient} = await getPatientDetails();
		let all = `<td></td><td><form id="edit-form" onsubmit="return false">
		<div id="edit-patient-msg" role="alert" disabled>
            
        </div>
		<div class="col-lg-10 offset-lg-1">
		  <div class="form-group">
		  	<label for="firstName">First name:</label>
			<input type="text" placeholder="First name" value="${patient.firstName}" name="firstName" id="firstName"
			  class="form-control form-control-lg"  autocomplete="off" required />
		  </div>
		</div>

		<div class="col-lg-10 offset-lg-1">
		  <div class="form-group">
			<label for="lastName">Last name:</label>
			<input type="text" placeholder="Last name" value="${patient.lastName}" name="lastName" id="lastName"
			  class="form-control form-control-lg"  autocomplete="off" required />
		  </div>
		</div>

		<div class="col-lg-10 offset-lg-1">
		  <div class="form-group">
			<label for="email">email:</label>
			<input type="text" placeholder="Enter Your email" value="${patient.email}" name="email" id="email"
			  class="form-control form-control-lg"  autocomplete="off" required />
		  </div>
		</div>

		<div class="col-lg-10 offset-lg-1">
		  <div class="form-group">
			<label for="dob">Date of birth:</label>
			<input type="date" name="dob" id="dob"
			  class="form-control form-control-lg" value="${patient.dob}"  autocomplete="off" required />
		  </div>
		</div>

		<div class="col-lg-10 offset-lg-1">
		  <div class="form-group">
			<label for="phoneNo">Phone No:</label>
			<input type="tel" name="phoneNo" id="phoneNo"
			  class="form-control form-control-lg"  maxlength="14" data-fv-numeric="true" data-fv-numeric-message="Please enter valid phone numbers" data-fv-phone-country11="IN" data-fv-notempty-message="This field cannot be left blank." placeholder="Mobile No. " data-fv-field="data[User][mobile]" value="${patient.phoneNo}" autocomplete="off" required />
		  </div>
		</div>

		<div class="col-lg-10 offset-lg-1">
		  <div class="form-group">
			<input type="submit" value="SAVE CHANGES" class="btn btn-primary form-control-lg btn-lg btn-block"
			 id="edit-patient-btn" onclick="javascript:editPatientDetails()"  autocomplete="off" required/>
		  </div>
		</div>
		
	  </form></td><td></td>`;
	  document.getElementById('col-names').innerHTML = `<tr>
					<th scope="col"></th>
					<th scope="col"></th>
					<th scope="col"></th>
				</tr>`;
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;

		document.getElementById('main-dashboard-head').innerHTML = `<span class="material-icons" style="vertical-align: bottom; font-size: 25px;">
		edit
		</span> Edit details`;
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
};
window.myAppointments = async function() {
	try {
		let {appointments} = await myAppointments();
		let all = "";
		for (let i = 0; i < appointments.length; i++) {
			all += `<tr>
			<td scope="row"><span class="material-icons" style="vertical-align: bottom">
			event
			</span> ${appointments[i].id}</td>
			<td>
				${appointments[i].firstName+' '+appointments[i].lastName}
			</td>
			<td>${appointments[i].specialization}</td>
			<td>${appointments[i].appointmentStatus}</td>
			<td>${appointments[i].createdDate.substr(0, 24)}</td>
			<td>${appointments[i].startTime}</td>
		</tr>`;
		}
		document.getElementById('col-names').innerHTML = `<tr>
					<th scope="col">APPOINTMENT ID</th>
					<th scope="col">DOCTOR NAME</th>
					<th scope="col">SPECIALIZATION</th>
					<th scope="col">APPOINTMENT STATUS</th>
					<th scope="col">DATE OF APPOINTMENT</th>
					<th scope="col">TIME</th>
				</tr>`;
		document.getElementById('main-dashboard-head').innerHTML = `<span class="material-icons" style="vertical-align: bottom; font-size: 25px;">
		calendar_today
		</span> Doctors List`;
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
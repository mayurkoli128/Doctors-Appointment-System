import { 
	addDoctor, 
	deleteDoctor, 
	getAllDoctors, 
    getDoctorDetails,
	updateDoctorDetails, 
	getAllPatients,
	getAllAppointments,
	getPatientDetailsByID,
	uploadMedicalReport,
	getMedicalReports,
	sendReports
} from '../API/server.js';

import {show} from '../partials/messages.js';

// upload report documents...
let uploadReport = document.getElementById('patient-report-form');
uploadReport.addEventListener('submit', async (event)=> {
	event.preventDefault();
	let e = uploadReport.elements ;
	let formData = new FormData();

	let appointmentID = document.getElementById('appointment-id').getAttribute('data-content');
	formData.append('patientReport', e[0].files[0]);
	try {
		let {response} = await uploadMedicalReport(formData, appointmentID);
		show(response.message, "success", "upload-report-msg");
	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "system-msg");
		console.log(error);
	}
	return false ;
});
// add secret
let insertForm = document.getElementById('add-doctor');
insertForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	let e = insertForm.elements;
	let gender = "Male";
	if (e[6].checked) gender = "Female";
	let doctor = {
		firstName: e[0].value,
		lastName: e[1].value,
		qualification: e[2].value,
		specialization: e[3].value,
		email: e[4].value,
		gender: gender,
		phoneNo: e[7].value,
		intro: e[8].value,
        avatar: getRandomColor(),
	};
	try {
		let res = await addDoctor(doctor);
		show(res.response.message, "success", "add-doctor-msg");
		insertForm.reset();
		document.getElementsByClassName('close')[0].click();
		viewDoctors();
	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "system-msg");
		console.log(error);
	}
	return false ;
});
// send reports to doctor
window.sendReports = async function (from, to) {
	show('The operation will attached medical history of patient and may take a signficant amount of time to complete, you will be notified shortly.', "warning", "system-msg");
	try {
		let res = await sendReports(from, to);
		show('Message has been sent', "success", "system-msg");
	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "system-msg");
		console.log(error);
	}
}
// delete secret
window.deleteDoctor = async function (id) {
	if (!confirm('Are you sure you want to delete the record permanently, Continue ?')) return;
	try {
		let res = await deleteDoctor(id);
		if (res.response.ok)	editDetails();
	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "system-msg");
		console.log(error);
	}
}
// update only modified fields...
let rwForm = document.getElementById('update-doctor');
rwForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	let e = rwForm.elements;
	let gender = "Male";
	if (e[6].checked) gender = "Female";
	let doctor = {
		firstName: e[0].value  ,
		lastName: e[1].value  ,
		qualification: e[2].value ,
		specialization: e[3].value  ,
		email: e[4].value,
		phoneNo: e[7].value ,
		gender: gender,
		intro: e[8].value ,
	};
	let doctorId = document.getElementById('record-id').getAttribute('data-content');
	try {
		let res = await updateDoctorDetails(doctor, doctorId);
		if (res.response.ok) {
			editDetails();
			document.getElementsByClassName('close')[1].click();
			rwForm.reset();
			document.getElementById('doctorUpdate').disabled=true;
		}
	} catch (error) {
		// ohh no! something went wrong....
		show(error.response.message, "danger", "system-msg");
		console.log(error);
	}
});
// get details of doctor only...not provide updation...
window.getDoctorDetails = async function (id, toUpdate=false) {
	document.getElementById('record-id').setAttribute("data-content", id);
	try {
		let {doctor, admin} = await getDoctorDetails(id, status);
		if (toUpdate) {
			var e = rwForm.elements;
			e[0].value = doctor.firstName;
			e[1].value = doctor.lastName;
			e[2].value = doctor.qualification;
			e[3].value = doctor.specialization;
			e[4].value = doctor.email;
			e[7].value = doctor.phoneNo;
			e[8].value = doctor.intro;
			if (doctor.gender == 'Male') {
				document.getElementById('m').checked = true ;
			} else {
				document.getElementById('f').checked = true ;
			}
			$('#update-doctor-modal').modal('show');
		} else {
			let all = `<table class="table table-striped">
					<thead>
					<tr>
						<th></th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<th>FIRST NAME : </th>
						<td>${doctor.firstName}</td>
					</tr>
					<tr>
						<th>LAST NAME : </th>
						<td>${doctor.lastName}</td>
					</tr>
					<tr>
						<th>GENDER : </th>
						<td>${doctor.gender}</td>
					</tr>
					<tr>
						<th>QUALIFICATION : </th>
						<td>${doctor.qualification}</td>
					</tr>
					<tr>
						<th>SPECIALIZATION : </th>
						<td>${doctor.specialization}</td>
					</tr>
					<tr>
						<th>EMAIL : </th>
						<td>${doctor.email}</td>
					</tr>
					<tr>
						<th>PHONE NO : </th>
						<td>${doctor.phoneNo}</td>
					</tr>
					</tbody>
				</table>`;
			document.getElementById('finally-show-details').innerHTML = all;
			$('#doctor-details-modal').modal('show');
		}
	} catch (error) {
		show("Something failed!", "danger", "system-msg");
		console.log(error);
	}
}
// view all doctors
window.editDetails = async function () {
	try {
		let {doctors} = await getAllDoctors();
		let all = "";
		for (let i = 0; i < doctors.length; i++) {
			doctors[i].createdDate = timeSince(new Date(doctors[i].createdDate));
			all += `<tr class="table-row">
                <td> 
                <span class="material-icons" style="vertical-align: bottom;">person</span>
				${doctors[i].id}</td>

                <td scope="row"   onclick="getDoctorDetails(this.id, true)" id="${doctors[i].id}"  style="cursor: pointer;">
					${doctors[i].firstName + " " + doctors[i].lastName}
				</td>

				<td>${doctors[i].createdDate}</td>

                <td  style="cursor: pointer;">
                  <div class="btn-group">
                    <span class="material-icons" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      more_vert
                    </span>
                    <div class="dropdown-menu">
                      <li><a class="dropdown-item" name="${doctors[i].id}" onclick="getDoctorDetails(this.name)">Show</a></li>
                      <li><a class="dropdown-item" onclick="deleteDoctor(this.name);" data-toggle="modal" data-target="#confirm-delet" name=${doctors[i].id}>Delete data</a></li>
                    </div>
                  </div>
                </td>
              </tr>`;
		}
		document.getElementById('col-names').innerHTML = `<tr>
					<th scope="col">ID</th>
					<th scope="col">DOCTOR NAME</th>
					<th scope="col">LAST MODIFIED</th>
				</tr>`;
		document.getElementById('main-dashboard-head').innerHTML = `<span class="material-icons" style="vertical-align: bottom; font-size: 25px;">
		edit
		</span> Edit details`;
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;

	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}
window.setAppointmentId = async function(id) {
	document.getElementById('appointment-id').setAttribute("data-content", id);
	$('#upload-report-modal').modal('show');
}	
window.viewAppointmentDetails = async function() {
	try {
		let {appointments} = await getAllAppointments();
		let all = "";
		for (let i = 0; i < appointments.length; i++) {

			if (appointments[i].createdDate.substring(0, 15) !== new Date().toString().substring(0, 15)) {
				continue ;
			}

			all += `<tr class="table-row">
                <td> 
                <span class="material-icons" style="vertical-align: bottom;">calendar_today</span>
				${appointments[i].appointmentID}</td>

				<td>${appointments[i].patientsID}</td>
				<td>${appointments[i].patientsFirstName + " " + appointments[i].patientsLastName}</td>

				<td>${appointments[i].createdDate}</td>
				<td>${appointments[i].appointmentStatus}</td>
				<td>${appointments[i].startTime}</td>

				<td>${appointments[i].doctorsID}</td>
                <td scope="row">
					${appointments[i].doctorsFirstName + " " + appointments[i].doctorsLastName}
				</td>
				<td>${appointments[i].specialization}</td>
				<td>
					<button type="button" class="btn btn-info"> 
						<span class="material-icons" style="vertical-align: bottom;" onclick="sendReports(${appointments[i].doctorsID}, ${appointments[i].patientsID})">send</span>
					</button>
				</td>
				<td>
					<button type="button" class="btn btn-info"> 
						<span class="material-icons" style="vertical-align: bottom;"  onclick="setAppointmentId(${appointments[i].appointmentID})">upload</span>
					</button>
				</td>
			</tr>`;
		}
		document.getElementById('col-names').innerHTML = `<tr>
					<th scope="col">APPOINTMENT ID</th>
					<th scope="col">PATIENT ID</th>
					<th scope="col">PATIENT NAME</th>
					<th scope="col">DATE OF APPOINTMENT</th>
					<th scope="col">APPOINTMENT STATUS</th>
					<th scope="col">TIME</th>
					<th scope="col">DOCTOR ID</th>
					<th scope="col">DOCTOR NAME</th>
					<th scope="col">SPECIALIZATION</th>
					<th scope="col">SEND REPORTS TO DOCTOR</th>
					<th scope="col">UPLOAD REPORT</th>
					
				</tr>`;
		document.getElementById('main-dashboard-head').innerHTML = `<span class="material-icons" style="vertical-align: bottom; font-size: 25px;">
		event
		</span> View appointments`;
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}
window.medicalHistory = async function(id) {
	try {
		const {patient} = await getPatientDetailsByID(id);
		const {reports} = await getMedicalReports(id);
		let all = `<thead>
			<tr>
			<th scope="col">REPORT ID</th>
			<th scope="col">DOCTOR ID</th>
			<th scope="col">FILENAME</th>
			<th scope="col">DATE OF APPOINTMENT</th>
			<th scope="col">VIEW REPORT</th>
			</tr>
		</thead>`;
		for (let i = 0; i < reports.length; i++) {
			all += `<tr class="table-row">
                <td>${reports[i].id}</td>
                <td>${reports[i].doctorId}</td>
                <td>${reports[i].fileName}</td>
                <td>${reports[i].createdDate}</td>
                <td><a href="uploads/${reports[i].fileName}" class="btn btn-info" target="_blank">click here</a>
			</tr>`;
		}
		document.getElementById('medical-reports-table').innerHTML = all;
		document.getElementById('patientEmail').innerHTML = patient[0].email;
		document.getElementById('patientPhoneNo').innerHTML = patient[0].phoneNo;
		document.getElementById('patientName').innerHTML = patient[0].firstName+" "+patient[0].lastName;
		document.getElementById('patientGender').innerHTML = patient[0].gender;
		document.getElementById('patientDOB').innerHTML = patient[0].dob;
		document.getElementById('patient-id').setAttribute("data-content", id);

		$('#patient-details-modal').modal('show');
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}
window.viewPatientDetails = async function () {
	try {
		let {patients} = await getAllPatients();
		let all = "";
		for (let i = 0; i < patients.length; i++) {
			all += `<tr class="table-row">
                <td> 
                <span class="material-icons" style="vertical-align: bottom;">person</span>
				${patients[i].id}</td>

                <td scope="row">
					${patients[i].firstName + ' ' + patients[i].lastName}
				</td>

				<td>${patients[i].gender}</td>
				<td>${patients[i].phoneNo}</td>
				<td>${patients[i].email}</td>
				<td><button type="button" class="btn btn-info" onclick = "medicalHistory(${patients[i].id})">View Details</button></td>
				
			</tr>`;
		}
		document.getElementById('col-names').innerHTML = `<tr>
					<th scope="col">ID</th>
					<th scope="col">PATIENT NAME</th>
					<th scope="col">GENDER</th>
					<th scope="col">CONTACT NO.</th>
					<th scope="col">EMAIL</th>
					<th scope="col">MEDICAL REPORTS</th>
				</tr>`;
		document.getElementById('main-dashboard-head').innerHTML = `<span class="material-icons" style="vertical-align: bottom; font-size: 25px;">
		person
		</span> View patients`;
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;

	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}
window.viewDoctors = async function() {
	try {
		let {doctors, admin} = await getAllDoctors();
		let all = "";
		for (let i = 0; i < doctors.length; i++) {
			let logo = doctors[i].firstName[0]+doctors[i].firstName[1], options="", disabled="";
			logo = logo.toUpperCase();
			all += `<tr style="cursor: pointer;" id="${doctors[i].id}" onclick="getDoctorDetails(this.id)">
			
			<td scope="row"><span class="material-icons" style="vertical-align: bottom; color: green;">verified</span></td>
			<td scope="row"><span class="profile-logo" style="background-color: ${doctors[i].avatar}"> ${logo}</span></td>
			<td>
			
				${doctors[i].firstName + ' ' + doctors[i].lastName}
			</td>
			<td>
				${doctors[i].specialization}
			</td>
		</tr>`;
		}
		document.getElementById('col-names').innerHTML = `<tr>
					<th scope="col"></th>
					<th scope="col">AVATAR</th>
					<th scope="col">DOCTOR NAME</th>
					<th scope="col">SPECIALIZATION</th>
				</tr>`;
		document.getElementById('main-dashboard-head').innerHTML = `<span class="material-icons" style="vertical-align: bottom; font-size: 25px;">
		person
		</span> View doctors`;
		const tbody = document.getElementById('current-details');
		tbody.innerHTML = all;
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
};
viewDoctors();
function timeSince(date) {
	let val; 
	
	let seconds = Math.floor((new Date() - date) / 1000);
  
	let interval = seconds / 31536000;
  
	if (interval > 1) {
	  val = Math.floor(interval);
	  if (val == 1)	return "a year ago";
	  else return val + " years ago";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
	  val = Math.floor(interval);
	  if (val == 1)	return "a month ago";
	  else return val + " months ago";
	}
	interval = seconds / 86400;
	if (interval > 1) {
	  val = Math.floor(interval);
	  if (val == 1)	return "a day ago";
	  else return val + " days ago";
	}
	interval = seconds / 3600;
	if (interval > 1) {
	  val = Math.floor(interval);
	  if (val == 1)	return "an hour ago";
	  else return val + " hours ago";
	}
	interval = seconds / 60;
	if (interval > 1) {
	  val = Math.floor(interval);
	  if (val == 1)	return "a minute ago";
	  else return val + " minutes ago";
	}
	return "a few seconds ago";
  }
  function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
function getTime() {
	var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
	document.getElementById('currTime').innerHTML = "Make an appointment "+utc;
}	

rwForm.addEventListener('input', () => {
	const obj = document.getElementById('doctorUpdate');
	obj.disabled = false;
});
import { 
	getAllDoctors1, 
    getDoctorDetails,
} from '../API/server.js';


import {show} from '../partials/messages.js';

window.viewDoctors = async function () {
	try {
		let {doctors, admin} = await getAllDoctors1();
		let all = "";
		for (let i = 0; i < doctors.length; i++) {
			doctors[i].lastModifiedAt = timeSince(Date.now());
			all += `<tr class="table-row">
                <td> 
                <span class="material-icons" style="vertical-align: bottom;">person_outline</span>
				${doctors[i].id}</td>

                <td scope="row"  onclick="getDoctorDetails(this.id)" id="${doctors[i].id}"  style="cursor: pointer;">
					${doctors[i].firstName}
				</td>

				<td>${doctors[i].lastModifiedAt} - ${admin}</td>

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
		const tbody = document.getElementById('all-doctors');
		tbody.innerHTML = all;
	} catch (error) {
		// ohh no! something went wrong....
		show(error, "danger", "system-msg");
		console.log(error);
	}
}
viewDoctors();
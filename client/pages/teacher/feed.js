import api from "../../services/api.js";

const url_user = new URLSearchParams(window.location.search);
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");

async function user_data() {
	const email = url_user.get("name");
	console.log(email);
	try {
		const res = await api.get(`/feed/${email}`);
		const userData = res.data;
		userName.textContent = `${userData.userFirstName} ${userData.userLastName}`;
		userMail.textContent = userData.userEmail;
		userType.textContent = userData.userType;
	} catch (err) {
		console.error(err);
	}
}

user_data();

let CODE = document.getElementById("code");
let num = 0;

function randomNum() {
	num = Math.floor(Math.random() * 10000);
	console.log(num);
	CODE.textContent = num;
}

function submitHandler(event) {
	// to prevent default submit action of html form
	event.preventDefault();
}

//// Location criteria
var T_Latitude;
var T_Longitude;

function teacher_location() {
	const options_obj = {
		enableHighAccuracy: true,
		timeout: 5000,
	};
	const successCallback = (position) => {
		T_Latitude = position.coords.latitude;
		T_Longitude = position.coords.longitude;

		console.log(T_Longitude);
		console.log(position);
		console.log(T_Latitude);
	};
	const errorCallback = (error) => {
		console.log(
			"Error while, getting teacher's location: " + error.message
		);
	};

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			successCallback,
			errorCallback,
			options_obj
		);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}
teacher_location();

const Year = document.getElementById("year");
const Branch = document.getElementById("branch");
const Subject = document.getElementById("subject");
const Div = document.getElementById("div");
const Message = document.querySelector(".message");
var id;
async function createPost() {
	const year = Year.value;
	const branch = Branch.value;
	const sub = Subject.value;
	const div = Div.value;
	const code = num;
	console.log(num);
	id = `${sub}_${code}`;
	// console.log("id--", id);
	try {
		const result = await api.post("/generate/session", {
			base: id,
			key: code,
			subject: sub,
			year: year,
			branch: branch,
			div: div,
			latitude: T_Latitude,
			longitude: T_Longitude,
		});
		const data = result.data;
		const messageEl = document.getElementById("message");
		messageEl.className = "message success";
		messageEl.textContent = data.msg;
		console.log(data);
		setTimeout(() => {
			const email = url_user.get("name");
			var url = `session.html?name=${encodeURIComponent(
				email
			)}&id=${encodeURIComponent(id)}`;
			window.location.href = url;
		}, 1000);
	} catch (err) {
		const messageEl = document.getElementById("message");
		messageEl.className = "message error";
		messageEl.textContent = err.response?.data?.msg || err.message;
	}
}

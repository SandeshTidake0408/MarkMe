import api from "../../services/api.js";

const url_user = new URLSearchParams(window.location.search);
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");
const Message = document.querySelector(".message");
const countElement = document.getElementById("count");
const timerElement = document.getElementById("timer");
const downloadButton = document.getElementById("download_btn");
const stopButton = document.getElementById("stop_btn");
const user = url_user.get("name");
const id = url_user.get("id");
const subj = id ? id.split("_")[0] : "";

// Add event listener for stop button
if (stopButton) {
	stopButton.addEventListener("click", stop_session);
}
//date and time for file name
const currentDate = new Date();
const formattedDate = currentDate
	.toLocaleString("en-US", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	})
	.replace(/[^\w\s]/g, "-");

async function user_data() {
	try {
		const response = await api.get(`/feed/${user}`);
		const userData = response.data;
		userName.textContent = `${userData.userFirstName} ${userData.userLastName}`;
		userMail.textContent = userData.userEmail;
		userType.textContent = userData.userType;
	} catch (err) {
		console.error("Error fetching user data:", err);
	}
}

user_data();

async function Cancel() {
	try {
		const res = await api.post(`/delete/${id}`, {
			email: user,
		});
		const data = res.data;
		const messageEl = document.getElementById("message");
		messageEl.className = "message success";
		messageEl.textContent = data.msg;
	} catch (err) {
		const messageEl = document.getElementById("message");
		messageEl.className = "message error";
		messageEl.textContent = err.response?.data?.msg || err.message || "Failed to cancel session";
	}
}

//timer
function startTimer(endTime) {
	// var duration = 5 * 60 * 1000; // 5 minutes in milliseconds
	// var endTime = new Date().getTime() + duration;
	var intervalId = setInterval(function () {
		var currentTime = new Date().getTime();
		var remainingTime = endTime - currentTime;

		if (remainingTime > 0) {
			var minutes = Math.floor(
				(remainingTime % (1000 * 60 * 60)) / (1000 * 60)
			);
			var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

			var formattedMinutes = ("0" + minutes).slice(-2);
			var formattedSeconds = ("0" + seconds).slice(-2);
			timerElement.textContent = formattedMinutes + ":" + formattedSeconds;
			// console.log(formattedMinutes + ":" + formattedSeconds);
		}

		if (remainingTime <= 0) {
			clearInterval(intervalId);
			console.log("Timer has ended!");
			sheet_download();
		}
	}, 1000);
}
var server_time;
async function get_time() {
	try {
		const res = await api.get(`/feed/timer/${id}`);
		server_time = res.data.endTime;
		startTimer(server_time);
	} catch (err) {
		const messageEl = document.getElementById("message");
		messageEl.className = "message error";
		messageEl.textContent = err.response?.data?.msg || err.message || "Failed to get timer";
	}
}
get_time();

async function stop_session() {
	try {
		const res = await api.post(`/delete/${id}`, {
			endTime: server_time,
			subject: subj,
		});
		const messageEl = document.getElementById("message");
		messageEl.className = "message success";
		messageEl.textContent = res.data.msg;
		sheet_download();
	} catch (err) {
		const messageEl = document.getElementById("message");
		messageEl.className = "message error";
		messageEl.textContent = err.response?.data?.msg || err.message || "Failed to stop session";
	}
}

function sheet_save(data) {
	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.json_to_sheet(data);
	XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
	const excelBuffer = XLSX.write(workbook, {
		bookType: "xlsx",
		type: "buffer",
	});
	const blob = new Blob([excelBuffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	const filePath = URL.createObjectURL(blob);

	return filePath;
}
// console.log("hii ", sheet_save(data));

async function sheet_download() {
	try {
		const res = await api.post(`/download/${id}`);
		const sheet = res.data.sheet_array;
		const path_url = sheet_save(sheet);
		const len = sheet.length;
		countElement.textContent = len.toString().padStart(2, '0');
		if (stopButton) stopButton.disabled = true;
		downloadButton.classList.remove("disabled");
		downloadButton.style.pointerEvents = "auto";
		downloadButton.style.opacity = "1";
		downloadButton.href = path_url;
		downloadButton.download = `${user}_${id}_${formattedDate}.xlsx`;
	} catch (err) {
		const messageEl = document.getElementById("message");
		messageEl.className = "message error";
		messageEl.textContent = err.response?.data?.msg || err.message || "Failed to download sheet";
		console.error("Download error:", err);
	}
}

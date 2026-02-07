import api from "../../services/api.js";
import { getQueryParam } from "../../utils/helpers.js";

const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");
const Message = document.querySelector(".message");
const countElement = document.getElementById("count");
const timerElement = document.getElementById("timer");
const downloadButton = document.getElementById("download_btn");
const stopButton = document.getElementById("stop_btn");
const user = getQueryParam("name");
const id = getQueryParam("id");
const sessionCode = getQueryParam("code") || "";

// Get session data from URL parameters - keep subject and code separate
const sessionSubject = getQueryParam("subject") || "";
const sessionYear = getQueryParam("year") || "";
const sessionBranch = getQueryParam("branch") || "";
const sessionDiv = getQueryParam("div") || "";

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

function loadSessionInfo() {
	// Populate session info from URL parameters - keep subject and code separate
	const subjectEl = document.getElementById("subject");
	const codeEl = document.getElementById("code");
	const yearEl = document.getElementById("year");
	const branchEl = document.getElementById("branch");
	const divEl = document.getElementById("div");
	
	if (subjectEl && sessionSubject) subjectEl.textContent = sessionSubject.toUpperCase();
	if (codeEl && sessionCode) codeEl.textContent = sessionCode.padStart(4, '0');
	if (yearEl && sessionYear) yearEl.textContent = sessionYear.toUpperCase();
	if (branchEl && sessionBranch) branchEl.textContent = sessionBranch;
	if (divEl && sessionDiv) divEl.textContent = sessionDiv.toUpperCase();
}

user_data();
loadSessionInfo();
 
// Show cancel confirmation dialog
function showCancelDialog() {
	const dialog = document.getElementById("cancelDialog");
	if (dialog) {
		dialog.showModal();
	}
}

// Actually cancel the session
async function Cancel() {
	try {
		const res = await api.post(`/delete/${id}`, {
			email: user,
		});
		const data = res.data;
		
		// Close dialog
		const dialog = document.getElementById("cancelDialog");
		if (dialog) {
			dialog.close();
		}
		
		const messageEl = document.getElementById("message");
		messageEl.className = "message success";
		messageEl.textContent = data.msg;
		
		// Clear the timer interval if it exists
		if (timerIntervalId) {
			clearInterval(timerIntervalId);
			timerIntervalId = null;
		}
		
		// Reset timer display
		if (timerElement) {
			timerElement.textContent = "00:00";
		}
		
		// Disable stop button
		if (stopButton) {
			stopButton.disabled = true;
		}
		
		// Redirect to feed page after a short delay
		setTimeout(() => {
			const email = getQueryParam("name");
			window.location.href = `feed.html?name=${encodeURIComponent(email)}`;
		}, 1500);
	} catch (err) {
		// Close dialog on error
		const dialog = document.getElementById("cancelDialog");
		if (dialog) {
			dialog.close();
		}
		
		const messageEl = document.getElementById("message");
		messageEl.className = "message error";
		messageEl.textContent = err.response?.data?.msg || err.message || "Failed to cancel session";
	}
}

// Store timer interval ID globally so we can clear it
var timerIntervalId = null;

//timer
function startTimer(endTime) {
	// Clear any existing timer
	if (timerIntervalId) {
		clearInterval(timerIntervalId);
	}
	
	timerIntervalId = setInterval(function () {
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
		}

		if (remainingTime <= 0) {
			clearInterval(timerIntervalId);
			timerIntervalId = null;
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
			subject: sessionSubject,
		});
		
		// Clear the timer interval
		if (timerIntervalId) {
			clearInterval(timerIntervalId);
			timerIntervalId = null;
		}
		
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

// Set up event listeners
function initEventListeners() {
	if (stopButton) {
		stopButton.addEventListener("click", stop_session);
	}
	
	const cancelBtn = document.getElementById("cancelBtn");
	if (cancelBtn) {
		cancelBtn.addEventListener("click", showCancelDialog);
	}
	
	// Dialog buttons
	const cancelDialog = document.getElementById("cancelDialog");
	const cancelDialogConfirm = document.getElementById("cancelDialogConfirm");
	const cancelDialogCancel = document.getElementById("cancelDialogCancel");
	
	if (cancelDialogConfirm) {
		cancelDialogConfirm.addEventListener("click", Cancel);
	}
	
	if (cancelDialogCancel) {
		cancelDialogCancel.addEventListener("click", () => {
			if (cancelDialog) {
				cancelDialog.close();
			}
		});
	}
	
	// Close dialog when clicking outside
	if (cancelDialog) {
		cancelDialog.addEventListener("click", (e) => {
			if (e.target === cancelDialog) {
				cancelDialog.close();
			}
		});
	}
	
	const profileSignOutBtn = document.getElementById("profileSignOutBtn");
	
	if (profileSignOutBtn && typeof SignOut === 'function') {
		profileSignOutBtn.addEventListener("click", SignOut);
	}
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initEventListeners);
} else {
	initEventListeners();
}

// Export functions
export { Cancel, stop_session };

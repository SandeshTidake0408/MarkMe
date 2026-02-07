const fname = document.getElementById("name");
const lname = document.getElementById("l_name");
const div = document.getElementById("div");
const branch = document.getElementById("branch");
const rollno = document.getElementById("roll_no");
const mobileno = document.getElementById("m_no");
const email = document.getElementById("mail");
const password = document.getElementById("pass");
const cpassword = document.getElementById("c_pass");
const Message = document.querySelector(".message");

function submitHandler(event) {
	// to prevent default submit action of html form
	event.preventDefault();
}

async function handelRegister() {
	var fName = fname.value;
	var lName = lname.value;
	var Div = div.value;
	var Branch = branch.value;
	var RollNo = rollno.value;
	var MobileNo = mobileno.value;
	var Email = email.value;
	var Password = password.value;
	var CPassword = cpassword.value;
	try {
		const response = await api.post("/auth/register/student", {
			firstName: fName,
			lastName: lName,
			div: Div,
			rollNo: RollNo,
			mobileNo: MobileNo,
			email: Email,
			password: Password,
			confPassword: CPassword,
			branch: Branch,
		});

		const messageEl = document.getElementById("message");
		messageEl.className = "message success";
		messageEl.textContent = "Sign Up Successful! Redirecting...";
		setTimeout(() => {
			window.location.href = "login.html";
		}, 1500);
	} catch (error) {
		const messageEl = document.getElementById("message");
		messageEl.className = "message error";
		if (
			error.response?.data?.msg ==
			"Duplicate value entered for email field, please choose another value"
		) {
			messageEl.textContent = "Account Already Exists For This Email";
		} else {
			messageEl.textContent = error.response?.data?.msg || error.message;
		}
	}
}

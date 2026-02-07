const fname = document.getElementById("name");
const lname = document.getElementById("l_name");
const mobileno = document.getElementById("m_no");
const email = document.getElementById("mail");
const password = document.getElementById("pass");
const cpassword = document.getElementById("c_pass");
const Message = document.querySelector(".message");

function submitHandler(event) {
    event.preventDefault();
}

async function handelRegister() {
    var fName = fname.value;
    var lName = lname.value;
    var MobileNo = mobileno.value;
    var Email = email.value;
    var Password = password.value;
    var CPassword = cpassword.value;
    try {
        const response = await api.post("/auth/register/teacher", {
            firstName: fName,
            lastName: lName,
            mobileNo: MobileNo,
            email: Email,
            password: Password,
            confPassword: CPassword,
        });

        const messageEl = document.getElementById("message");
        messageEl.className = "message success";
        messageEl.textContent = "Sign Up Successful! Redirecting...";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
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

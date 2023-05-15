const fname = document.getElementById("name");
const lname = document.getElementById("l_name");
const div = document.getElementById("div");
const branch = document.getElementById("branch");
const rollno = document.getElementById("roll_no");
const mobileno = document.getElementById("m_no");
const email = document.getElementById("mail");
const password = document.getElementById("pass");
const cpassword = document.getElementById("c_pass");

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
    const response = await axios
        .post("http://localhost:4000/api/v1/auth/register/student", {
            firstName: fName,
            lastName: lName,
            div: Div,
            rollNo: RollNo,
            mobileNo: MobileNo,
            email: Email,
            password: Password,
            confPassword: CPassword,
            branch: Branch,
        })
        .then((response) => {
            alert("SignUp Successful");
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert(error.response.data.msg);
        });
}

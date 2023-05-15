const fname = document.getElementById("name");
const lname = document.getElementById("l_name");
const mobileno = document.getElementById("m_no");
const email = document.getElementById("mail");
const password = document.getElementById("pass");
const cpassword = document.getElementById("c_pass");

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
  const response = await axios
    .post("http://localhost:4000/api/v1/auth/register/teacher", {
      firstName: fName,
      lastName: lName,
      mobileNo: MobileNo,
      email: Email,
      password: Password,
      confPassword: CPassword,
    })
    .then((res) => {
      
      alert("SignUp Successful");
      window.location.href = "login.html";
    })
    .catch((err) => {
      alert(err.message);
    });
}

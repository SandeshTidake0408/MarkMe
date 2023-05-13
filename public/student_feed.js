const url_user = new URLSearchParams(window.location.search);
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");
const branch = document.querySelector(".branch");
const div = document.querySelector(".Div");
const roll_no = document.querySelector(".roll_no");
let user_roll; // for global use

async function user_data() {
    const email = url_user.get("name");
    const res = await axios
        .get(`http://localhost:4000/api/v1/feed/${email}`)
        .then((res) => {
            const userData = res.data;
            userName.textContent = `${userData.userFirstName} ${userData.userLastName}`;
            userMail.textContent = userData.userEmail;
            userType.textContent = userData.userType;
            branch.textContent = userData.userBranch;
            div.textContent = userData.userDiv;
            roll_no.textContent = userData.userRollNo;
            user_roll = userData.userRollNo;
        })
        .catch((err) => {
            console.error(err);
        });
}

user_data();

function submitHandler(event) {
    // to prevent default submit action of html form
    event.preventDefault();
    document.getElementById("myForm").reset();
}

const sub = document.getElementById("subject");
const code = document.getElementById("code");
const markme_btn = document.getElementById("markme");
const mess = document.querySelector(".message");

markme_btn.addEventListener("click", async () => {
    const subject = sub.value;
    const key = code.value;
    const rollno = user_roll;
    const res = await axios
        .post("http://localhost:4000/api/v1/mark", {
            key: key,
            subject: subject,
            rollNo: rollno,
        })
        .then((result) => {
            mess.style.color = "#40ba55";
            mess.textContent = result.data;
        })
        .catch((error) => {
            if (error.response) {
                mess.style.color = "#ff3f3f";
                mess.textContent = error.response.data;
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
});

function SignOut() {
    localStorage.clear();
    window.location.href = "login.html";
    history.replaceState(null, "", "login.html");
}

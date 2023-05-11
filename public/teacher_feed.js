const url_user = new URLSearchParams(window.location.search);
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");

async function user_data() {
  const email = url_user.get("name");
  console.log(email);
  const response = await axios
    .get(`http://localhost:4000/api/v1/feed/${email}`)
    .then((res) => {
      const userData = res.data;
      userName.textContent = `${userData.userFirstName} ${userData.userLastName}`;
      userMail.textContent = userData.userEmail;
      userType.textContent = userData.userType;
    })
    .catch((err) => {
      console.error(err);
    });
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

const Year = document.getElementById("year");
const Branch = document.getElementById("branch");
const Subject = document.getElementById("subject");
const Div = document.getElementById("div");
const Message = document.querySelector(".message");

async function createPost() {
  const year = Year.value;
  const branch = Branch.value;
  const sub = Subject.value;
  const div = Div.value;
  const code = num;
  console.log(num);

  const response = await axios
    .post("http://localhost:4000/api/v1/generate/session", {
      base: `${sub}_${code}`,
      key: code,
      subject: sub,
      year: year,
      branch: branch,
      Div: div,
    })
    .then((result) => {
      const data = result.data;
      Message.style.color = "#40ba55";
      Message.textContent = data.msg;
      console.log(data);
      setTimeout(() => {
        const email = url_user.get("name");
        var url = `T_feed_2.html?name=${encodeURIComponent(email)}?id=${encodeURIComponent(num)}`;
        window.location.href = url;
      }, 1000);
    })

    .catch((err) => {
      Message.style.color = "#ff3f3f";
      Message.textContent = "Somthing might be wrong please try again !!";
    });
}

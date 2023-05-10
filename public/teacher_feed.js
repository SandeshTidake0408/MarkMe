const url_user = new URLSearchParams(window.location.search);
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");

async function user_data() {
  const email = url_user.get("name");
  const response = await axios
    .get(`http://localhost:8000/api/v1/feed/${email}`)
    .then((res) => {
      const userData = res.data;
      userName.textContent = `${userData.userFirstName} ${userData.userLastName}`;
      userMail.textContent = userData.userEmail;
      userType.textContent = userData.userType;
    })
    .catch((err) => {
      console.error(err);
    });
    // console.log(response);
}

user_data();

let CODE = document.getElementById("code");
let num = 0;

function randomNum() {
  num = Math.floor(Math.random() * 10000);
  console.log(num);
  CODE.textContent = num;
}


async function createPost(){
  
}
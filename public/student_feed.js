const url_user = new URLSearchParams(window.location.search);
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");
const branch = document.querySelector(".branch");
const div = document.querySelector(".Div");
const roll_no = document.querySelector(".roll_no");

async function user_data() {
  const email = url_user.get("name");
  const res = await axios
    .get(`http://localhost:8000/api/v1/feed/${email}`)
    .then((res) => {
      const userData = res.data;
      userName.textContent = `${userData.userFirstName} ${userData.userLastName}`;
      userMail.textContent = userData.userEmail;
      userType.textContent = userData.userType;
      branch.textContent = userData.userBranch;
      div.textContent = userData.userDiv;
      roll_no.textContent = userData.userRollNo;
    })
    .catch((err) => {
      console.error(err);
    });
}

user_data();

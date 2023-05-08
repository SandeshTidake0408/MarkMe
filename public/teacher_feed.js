const url_user = new URLSearchParams(window.location.search);
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");

async function user_data() {
  const email = url_user.get("name");
  const res = await axios
    .get(`http://localhost:8000/api/v1/feed/${email}`)
    .then((res) => {
      const userData = res.data;
      userName.textContent = `${userData.userFirstName} ${userData.userLastName}`;
      userMail.textContent = userData.userEmail;
      if (localStorage.getItem("user")) {
        var temp = "Teacher";
      } else {
        var temp = "Student";
      }
      userType.textContent = temp;
    })
    .catch((err) => {
      console.error(err);
    });
}

user_data();

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

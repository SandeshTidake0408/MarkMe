const login_button = document.getElementById("login_btn");
const mail = document.getElementById("mail");
const password = document.getElementById("pass");
const login_form = document.querySelector(".login-form");

function submitHandler(event) {
  // to prevent default submit action of html form
  event.preventDefault();
}

async function myFunction() {
  var mailvalue = mail.value;
  var passwordvalue = password.value;

  const response = await axios
    .post("http://localhost:8000/api/v1/auth/login", {
      email: mailvalue,
      password: passwordvalue,
    })

    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", response.data.user);
      const { token, user } = response.data;
      // console.log("user : ", user);

      if (localStorage.getItem("token")) {
        // console.log("Token found:", token);
        if (user) {
          const userName = response.data.email_id;
          const url = `teacher_feed.html?name=${encodeURIComponent(userName)}`;
          window.location.href = url;
        } else {
          const userName = response.data.email_id;
          const url = `student
          
          _feed.html?name=${encodeURIComponent(userName)}`;
          window.location.href = url;
        }
      }
    })

    .catch((error) => {
      // handle error
      console.log("Error occurred during request");
      console.log("Error message:", error.message);
      // mail.setAttribute("placeholder", error.message);
      alert("Invalid Credentials");
    });
}

//127.0.0.1:8000/api/v1/feed/sandesh@gmail.com

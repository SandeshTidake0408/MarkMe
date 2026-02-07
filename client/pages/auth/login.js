const login_button = document.getElementById("login_btn");
const mail = document.getElementById("mail");
const password = document.getElementById("pass");
const login_form = document.querySelector(".login-form");
const mess = document.querySelector(".message");

function submitHandler(event) {
    // to prevent default submit action of html form
    event.preventDefault();
    document.getElementById("myForm").reset();
}

async function myFunction() {
    var mailvalue = mail.value;
    var passwordvalue = password.value;

    try {
        const response = await api.post("/auth/login", {
            email: mailvalue,
            password: passwordvalue,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response.data.user);
        const { token, user } = response.data;
        // console.log("user : ", user);

        if (localStorage.getItem("token")) {
            // console.log("Token found:", token);
            const userName = response.data.email_id;
            if (user) {
                const url = `../teacher/feed.html?name=${encodeURIComponent(
                    userName
                )}`;
                window.location.href = url;
            } else {
                const url = `../student/feed.html?name=${encodeURIComponent(
                    userName
                )}`;
                window.location.href = url;
            }
        }
    } catch (error) {
        const messageEl = document.getElementById("message");
        messageEl.className = "message error";
        messageEl.textContent = error.response?.data?.msg || error.message;
        setTimeout(() => {
            messageEl.textContent = "";
            messageEl.className = "";
        }, 3000);
    }
}

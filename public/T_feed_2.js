const { default: axios } = require("axios");

const url_user = new URLSearchParams(window.location.search);
console.log("url_user", url_user.toString());
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");
const user = url_user.get("name");
const id = url_user.get("id");
console.log(user);

console.log(id);
async function user_data() {
    const response = await axios
        .get(`http://localhost:4000/api/v1/feed/${user}`)
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
const Message = document.querySelector(".message");
async function Cancel() {
    const res = await axios
        .post(`http://localhost:4000/api/v1/delete/${id}`, {
            email: user,
        })
        .then((result) => {
            const data = result.data;
            Message.style.color = "#40ba55";
            Message.textContent = data.msg;
        })
        .catch((err) => {
            Message.style.color = "#ff3f3f";
            Message.textContent = err.response.data.msg;
        });
}

async function sheet_download() {
    const res = await axios.post(`http://localhost:4000/api/v1/download/${id}`)

    .then((result) => {
        
        
    }).catch((err) => {
        
    });

}

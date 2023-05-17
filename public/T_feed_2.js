const XLSX = window.XLSX;
const axios = window.axios;
const path = window.path; // Not necessary if you're not using path in your code
const fs = window.fs; // Not necessary if you're not using fs in your code

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

function sheet_save(data) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
    });
    const filename = `${user}_${id}.xlsx`;
    const filePath = path.resolve(__dirname, filename); // Get the absolute file path

    fs.writeFileSync(filePath, excelBuffer, "binary");

    return filePath;
}
const down_btn = document.getElementById("download_btn");
async function sheet_download() {
    const res = await axios
        .post(`http://localhost:4000/api/v1/download/${id}`)

        .then((result) => {
            const sheet = result.data.sheet_array;
            const path_url = sheet_save(sheet);
            const downloadButton = document.getElementById("down_button");
            downloadButton.classList.remove("disabled");
            downloadButton.href = path_url;
        })
        .catch((err) => {
            Message.style.color = "#ff3f3f";
            Message.textContent = err.response.data.msg;
        });
}

down_btn();

// const data = [
//     {
//         rollNo: "16",
//         firstName: "shubham",
//         lastName: "phalke",
//     },
//     {
//         rollNo: "2",
//         firstName: "Laxmi",
//         lastName: "Padghan",
//     },
// ];

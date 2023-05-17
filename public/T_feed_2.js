const url_user = new URLSearchParams(window.location.search);
const userName = document.querySelector(".user_name");
const userMail = document.querySelector(".mail");
const userType = document.querySelector(".user_type");
const downloadButton = document.getElementById("download_btn");
const user = url_user.get("name");
const id = url_user.get("id");

//date and time for file name
const currentDate = new Date();
const formattedDate = currentDate
    .toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
    .replace(/[^\w\s]/g, "-");

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
    });
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const filePath = URL.createObjectURL(blob);

    return filePath;
}
// console.log("hii ", sheet_save(data));

async function sheet_download() {
    const res = await axios
        .post(`http://localhost:4000/api/v1/download/${id}`)

        .then((result) => {
            const sheet = result.data.sheet_array;
            const path_url = sheet_save(sheet);
            downloadButton.classList.remove("disabled");
            downloadButton.href = path_url;
            downloadButton.download = `${user}_${id}_${formattedDate}.xlsx`;
        })
        .catch((err) => {
            Message.style.color = "#ff3f3f";
            console.error(err);
        });
}

sheet_download();


const loginButton = document.getElementById("login-submit");
const errorField = document.getElementById("error-message");
const loginForm = document.getElementById("login-form");
const registerButton = document.getElementById("register-submit");
const contBtn = document.getElementById("contBtn");
const registerForm = document.getElementById("register-form");
const successCard = document.getElementById("card");
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const loginRedirectBtn = document.getElementById("login-redirect");
const registerRedirectBtn = document.getElementById("register-redirect");



async function fetchName() {
    let response = await fetch("/auth/user");
    let data = await response.json();
    return data.user.name;
}

if (window.location.host.includes("-qa")) {
    console.log("This is QA environment");
}

loginRedirectBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "block";
    registerSection.style.display = "none"
});

registerRedirectBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    registerSection.style.display = "block"
});

contBtn.addEventListener("click", (e) => {
    loginSection.style.display = "block";
    registerSection.style.display = "none"
    enableAllInputs();
});

registerButton.addEventListener("click", (e) => {
    e.preventDefault();
    disableAllInputs();
    register();
});

document.getElementById("start-btn").addEventListener("click", function (event) {
    let provider = event.currentTarget.dataset.provider;

    window.location = `/auth/login/federated/${provider}`;
});

document.getElementById("github-btn").addEventListener("click", function (event) {
    let provider = event.currentTarget.dataset.provider;

    window.location = `/auth/login/federated/${provider}`;
});

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    disableAllInputs();
    login();
});

async function login() {
    let username = loginForm.username.value;
    let password = loginForm.password.value;
    let email = loginForm.email.value;
    let body = {
        username: username,
        email: email,
        password: password
    };

    const response = await fetch("https://id.tomsportfolio.co.za/login", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body), // body data type must match "Content-Type" header
      });

    let result = await response.json();
    console.log(result);
    if (response.status == 401) {
        enableAllInputs();
        errorField.innerHtml = "Invalid credentials. Login Failed";
        errorField.style.display = "block";
    } else if (response.status == 400) {
        enableAllInputs();
        errorField.style.display = "block";
        errorField.hidden = false;
        errorField.innerHtml = "Fill in all fields"; //should be checked before sending anyways
    } else if (response.ok) {
        errorField.style.display = "none";
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("refreshToken", result.refreshToken);
        window.location = `/auth/idserver/redirect/idserver?user=${username}&email=${email}&token=${result.token}&refreshToken=${result.refreshToken}&userId=${result.userID}`;
    }
}

function disableAllInputs() {
    console.log('disabling inputs')
    let inputs = document.getElementsByTagName("input"); 
    for (let i = 0; i < inputs.length; i++) { 
        inputs[i].disabled = true;
    } 
    let textareas = document.getElementsByTagName("textarea"); 
    for (let i = 0; i < textareas.length; i++) { 
        textareas[i].disabled = true;
    }
    let buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function enableAllInputs() {
    console.log('disabling inputs')
    let inputs = document.getElementsByTagName("input"); 
    for (let i = 0; i < inputs.length; i++) { 
        inputs[i].disabled = false;
    } 
    let textareas = document.getElementsByTagName("textarea"); 
    for (let i = 0; i < textareas.length; i++) { 
        textareas[i].disabled = false;
    }
    let buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}


async function register() {
    disableAllInputs();
    let username = registerForm.username.value;
    let password = registerForm.password.value;
    let passwordConfirm = registerForm.passwordConfirm.value;
    let email = registerForm.email.value;
    let body = {
        username: username,
        email: email,
        password: password
    };

    if (validateInputs(username, password, passwordConfirm, email)) {
        const response = await fetch("https://id.tomsportfolio.co.za/register", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached,
            
            headers: {
            "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(body), // body data type must match "Content-Type" header
        });

        if (response.status == 401) {
            enableAllInputs();
            alert("This user already exists")
        } else if (response.status == 400) {
            let result = await response.json();
            console.log(result);
            enableAllInputs();
            alert(`Registation error: ${result.error}`)
        } else if (response.ok) {
            console.log("registration successful")
            successCard.style.display = "block"
        }
    } else {
        enableAllInputs();
    }
}

function validateInputs(username, pass1, pass2, email) {
    if (checkAllFilled(username, pass1, pass2, email) && passwordsMatch(pass1, pass2)) {
        return true;
    }
    return false;
}

function checkAllFilled(username, pass1, pass2, email) {
    if (username == "" || pass1 == "" || pass2 == "" || email == "") {
        alert("Please fill in all fields");
        return false;
    }
    return true;
}

function passwordsMatch(pass1, pass2) {
    if (pass1 != pass2) {
        alert("Passwords do not match");
        return false;
    }
    return true;
}
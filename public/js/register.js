const registerButton = document.getElementById("register-submit");
const contBtn = document.getElementById("contBtn");
const registerForm = document.getElementById("register-form");
const successCard = document.getElementById("card");


contBtn.addEventListener("click", (e) => {
    window.location = "/public/index.html"
});

registerButton.addEventListener("click", (e) => {
    e.preventDefault();
    disableAllInputs();
    register();
});

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
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
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
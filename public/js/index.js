
const loginButton = document.getElementById("login-submit");
const errorField = document.getElementById("error-message");
const loginForm = document.getElementById("login-form");

async function fetchName() {
    let response = await fetch("/auth/user");
    let data = await response.json();
    return data.user.name;
}

if (window.location.host.includes("-qa")) {
    console.log("This is QA environment");
}

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

    const response = fetch("https://id.tomsportfolio.co.za/login", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "no-cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body), // body data type must match "Content-Type" header
      });

    response.then(x => {
        let y = x.json();
        y.then(z => {
            console.log(z);
            console.log();
        });
    }).catch(e => {
        console.log(e);
    })

    let result = await response.json();
    console.log(result);
    if (response.status == 401) {
        errorField.innerHtml = "Invalid credentials. Login Failed";
        errorField.style.display = "block";
    } else if (response.status == 400) {
        errorField.style.display = "block";
        errorField.innerHtml = "Fill in all fields"; //should be checked before sending anyways
    } else if (response.ok) {
        errorField.style.display = "none";
        window.location = `/auth/login/federated/idserver?user=${username}&email=${email}&token=${result.body.token}`;
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
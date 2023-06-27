import { config } from "dotenv";

config();

let token;


async function testLogin() {
    let username = "tom";
    let password = "test";
    let email = "t@t.com";
    let body = {
        username: username,
        email: email,
        password: password
    };
    console.log("before fetch")
    const response = await fetch("https://id.tomsportfolio.co.za/login", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "no-cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
        },
        // redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body), // body data type must match "Content-Type" header
      });
    console.log("after fetch")

    let result = await response.json();
    token = result.token;
    console.log(result);
}

async function testValidate() {
  const BASE_URI = process.env.ID_SERVER_URI;
  const VALID_URI = process.env.ID_SERVER_VALID;
  // let token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9tIiwiaWF0IjoxNjg3NzczMzk3LCJleHAiOjE2ODc3NzM0Mjd9.Wqijc-ONrXSdBefM8pI5m5kP5YkAx-4kXobtn9fxj9Q"
  let body = {
    token: token
  };
  console.log("before fetch")
  const response = await fetch("https://id.tomsportfolio.co.za/valid", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "no-cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
        },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body), // body data type must match "Content-Type" header
      });
  console.log("after fetch")

  // let result = await response.json();
  console.log(`valid response: ${response.status}`);
}

// testLogin()
await testLogin()
await testValidate()
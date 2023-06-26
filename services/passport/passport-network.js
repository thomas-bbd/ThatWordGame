import { insertUserRequest, selectFederatedCredentialsByIdRequest, insertFederatedCredentialsRequest } from "../../db/requests.js";
import { config } from "dotenv";

config();


export const userDBVerification = async (issuer, profile, cb) => {
    try {
        let response = await selectFederatedCredentialsByIdRequest(issuer, profile.id);

        let userId = -1;

        if (response.length == 0) {
            response = await insertUserRequest(profile.displayName);
            userId = response[0].get("user_id");

            await insertFederatedCredentialsRequest(userId, issuer, profile.id);
        }
        else {
            userId = response[0].get("user_id");
        }

        const user = {
            id: userId,
            name: profile.displayName
        };

        return cb(null, user);
    }
    catch (err) {
        console.log(err);
    }
}

export const githubUserDBInsert = async (profile, cb) => {
    try {
        let response = await selectFederatedCredentialsByIdRequest('github', profile.id);

        let userId = -1;

        if (response.length == 0) {
            response = await insertUserRequest(profile.username);
            userId = response[0].get("user_id");

            await insertFederatedCredentialsRequest(userId, 'github', profile.id);
            console.log('inserted github user into tables')
        }
        else {
            userId = response[0].get("user_id");
            console.log('github user was already in tables')
        }

        const user = {
            id: userId,
            name: profile.username
        };

        return cb(null, user);
    }
    catch (err) {
        console.log(err);
    }
}

export const idServerTokenValidation = async (req, cb) => {
    const BASE_URI = process.env.ID_SERVER_URI;
    const VALID_URI = process.env.ID_SERVER_VALID;
    let token = req.query.token;
    let username = req.query.user;
    let email = req.query.email;
    let refreshToken = req.query.refreshToken;
    let id = req.query.userId;
    let x = req.query;

    try {
        const response = await fetch(BASE_URI + VALID_URI, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({token: token, "test": "test"})
        });
        if (!response.ok) {
            console.log(response.status);
            return cb("AUTH FAILED", false, 'Error', 'JWT failed to validate. Please relogin and try again');
        }
        let user = await idServerDbInserts(username, id);
        return cb(null, user);
    }
    catch (err) {
        console.log(err);
    }
}

async function idServerDbInserts(username, id) {
    try {
        let response = await selectFederatedCredentialsByIdRequest('idserver', id);

        let userId = -1;

        if (response.length == 0) {
            response = await insertUserRequest(username);
            userId = response[0].get("user_id");

            await insertFederatedCredentialsRequest(userId, 'idserver', id);
            console.log('inserted idserver user into tables')
        }
        else {
            userId = response[0].get("user_id");
            console.log('idserver user was already in tables')
        }

        const user = {
            id: userId,
            name: username
        };

        return user;;
    }
    catch (err) {
        console.log(err);
    }
}
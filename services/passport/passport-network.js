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

export const idServerTokenValidation = async (req, cb) => {
    const BASE_URI = process.env.ID_SERVER_URI;
    const VALID_URI = process.env.ID_SERVER_VALID;
    let token = req.query.token;
    try {
        const response = await fetch(BASE_URI + VALID_URI, {
            method: "POST", 
            body: JSON.stringify({token: token, "test": "test"})
        });
        if (!response.ok) {
            console.log(response.status);
            return cb("AUTH FAILED", false, 'Error', 'JWT failed to validate. Please relogin and try again');
        }
        return cb(null, user);
    }
    catch (err) {
        console.log(err);
    }
}
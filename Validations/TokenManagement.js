import {GetUserByUsernameEmail} from '../Database/databaseAccess.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '30s'});
}

async function VerifyLogin(username, email, password){
    let result = await GetUserByUsernameEmail(username, email);
    if(result.length !== 0){
        try{
            let userID = result[0].id;
            let db_password = result[0].password;
            console.log(db_password);
            if(await bcrypt.compare(password, db_password)){
                return {success: true , userID};
            }
        }catch(error){
            return error;
        }
    }

    return {success: false , userID};;
}

function generateRefreshToken(user){
    return jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn : '60s'});
}


export {VerifyLogin, generateAccessToken, generateRefreshToken}
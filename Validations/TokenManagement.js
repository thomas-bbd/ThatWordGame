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
            let db_password = result[0].password;
            console.log(db_password);
            if(await bcrypt.compare(password, db_password)){
                return true;
            }
        }catch(error){
            return error;
        }
    }

    return false;
}

function generateRefreshToken(user){
    return jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn : '60s'});
}


export {VerifyLogin, generateAccessToken, generateRefreshToken}
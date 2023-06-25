/**
 * This server only handles user authentication
 */
import { InsertUser, FetchUsers, GetUserByUsernameEmail} from './databaseAccess.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
import { config } from "dotenv";

config();

//Allow us to read body requests as JSON
app.use(express.json()); 

//Refresh Token Storage for Testing
//NB -> DO NOT DO IN PROD
let refreshTokenStore = [];
let accessTokenStore = []; // need to be able to validate access tokens

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    const allowedOrigins = ['http://127.0.0.1:5501', 'http://127.0.0.1:5000', 'http://127.0.0.1:5000', 'http://localhost:5000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        console.log(`Denied request due to CORS policy from ${origin}`);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/', (req, res) => {
    res.send('Home endpoint');
});

//Test Endpoint
app.get('/test', (req,res)=>{
    res.status(200).json({message:'Test endpoint hit successfully'});
})

/**
 * login Logic
 * -> We recieve a login request from our client
 * -> We validate username and password
 * -> We issue a token
 * 
 * Refresh Tokens
 * -> We save the RT and when our access token expires we will refresh it
 * -> We invalidate our refresh token on logout so that it cannot be used to grant access
 */

app.post('/login', async (req,res)=>{
    //TO DO: Authenticate user using ARGON2
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const loginCredentialsValid = validateLoginInput(username,email,password);
    if(loginCredentialsValid.value){
        if(await VerifyLogin(username,email,password)){
            console.log(`Login Success for ${username}`);
            //Payload to Serialize
            const userPayload = {name: username};
            //Sign JWT
            const accessToken = generateAccessToken(userPayload);
            accessTokenStore.push(accessToken);
            //Create associated refresh token
            const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN, {expiresIn : '60s'});
            //Push our refresh token to the db/store
            refreshTokenStore.push(refreshToken);
            res.json({token: accessToken, refreshToken: refreshToken});
        }else{
            res.status(401).json({error:'Login Failed'});
        }
    }else{
        res.status(400).json({error: `Missing Input - ${loginCredentialsValid.param}`});
    }
});

/**
 *  User Registration 
 */

app.post('/register', async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let db_user = await GetUserByUsernameEmail(username, email);
    if(db_user.length === 0){
        await InsertUser(username,password,email);
        res.sendStatus(200);
    }else{
        res.status(401).json({error:'User Already Exists'}).send();
    }
});

/**
 * Token Refresh
 * -> When our original access token expires
 *    we will use our refresh token to generare a new one
 */

app.post('/token', (req,res)=>{
    //Fetch Token
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    //We should check in DB for token
    if(!refreshTokenStore.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err,user)=>{
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({name: user.name});
        res.json({accessToken: accessToken});
    })
})

/**
 * Checks the validity of a token
 */
app.post('/valid', (req, res) => {
    const token = req.body.token;
    if(token == null) return res.sendStatus(401);
    //We should check in DB for token
    if(!accessTokenStore.includes(token)) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_TOKEN, (err,user)=>{
        if(err) return res.sendStatus(403);
        res.sendStatus(200);
    })
})


/**
 * Delete refresh tokens to prevent
 * access if tokens are compromises/user logs out
 */
app.delete('/logout', (req,res)=>{
    //Query the DB and Remove the token
    refreshTokenStore = refreshTokenStore.filter(token => token !== req.body.token);
    return res.sendStatus(204);
})

function validateLoginInput(username,email,password){
    if(username == null || username == undefined || username.length === 0){
        return {param: 'username', value: false, message:'No Username Provided!'};
    }else if(email == null || email == undefined || email.length === 0){
        return {param: 'email', value: false, message:'No Email Provided!'};
    }else if(password == null || password == undefined || password.length === 0){
        return {param: 'password', value: false, message:'No Password Provided!'};
    }

    if(!(email.includes('@'))){
        return {param: 'email', value: false, message:'Incorrect Email Format!'};
    }

    return {param: 'login', value:true, message:'Login Input Valid'};
}


function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '30s'});
}


async function VerifyLogin(username, email, password){
    let result = await GetUserByUsernameEmail(username, email);
    console.log(result);
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

app.listen(port, ()=>{
    console.log(`Listening on localhost:${port}`);
});
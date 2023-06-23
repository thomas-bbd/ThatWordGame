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
const port = process.env.PORT || 4000;
import "dotenv/config.js";
//require('dotenv').config();

//Allow us to read body requests as JSON
app.use(express.json()); 

//Refresh Token Storage for Testing
//NB -> DO NOT DO IN PROD
let refreshTokenStore = [];

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
    console.log(username, email, password);
    if(username && password && email){
        if(await VerifyLogin(username,email,password)){
            console.log(`Login Success for ${username}`);
            //Payload to Serialize
            const userPayload = {name: username};
            //Sign JWT
            const accessToken = generateAccessToken(userPayload);
            //Create associated refresh token
            const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN, {expiresIn : '60s'});
            //Push our refresh token to the db/store
            refreshTokenStore.push(refreshToken);
            res.json({token: accessToken, refreshToken: refreshToken});
        }else{
            res.status(401).json({error:'Login Failed'});
        }
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
    console.log(db_user);
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
 * Delete refresh tokens to prevent
 * access if tokens are compromises/user logs out
 */
app.delete('/logout', (req,res)=>{
    //Query the DB and Remove the token
    refreshTokenStore = refreshTokenStore.filter(token => token !== req.body.token);
    return res.sendStatus(204);
})


function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '30s'});
}


async function VerifyLogin(username, email, password){
    let result = await GetUserByUsernameEmail(username, email);
    console.log(result);
    if(result.length !== 0){
        try{
            let db_password = result[0].password;
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
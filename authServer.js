/**
 * This server only handles user authentication
 */
import { InsertUser, GetUserByUsernameEmail} from './Database/databaseAccess.js';
import { VerifyLogin, generateAccessToken, generateRefreshToken} from './Validations/TokenManagement.js';
import {validateLoginInput, validateRegistrationInput} from './Validations/InputValidation.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
    
    const origin = req.headers.origin;
    if (validateOrigin(origin)) {
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


app.post('/login', async (req,res)=>{
    //TO DO: Authenticate user using ARGON2
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const loginCredentialsValid = validateLoginInput(username,email,password);
    if(loginCredentialsValid.value){
        const userLoginSuccess = await VerifyLogin(username,email,password);
        if(userLoginSuccess.success){
            console.log(`Login Success for ${username}`);
            //Payload to Serialize
            const userPayload = {name: username};
            //Sign JWT
            const accessToken = generateAccessToken(userPayload);
            accessTokenStore.push(accessToken);
            console.log(`added ${accessToken} to the store`)
            //Create associated refresh token
            const refreshToken = generateRefreshToken(userPayload);
            refreshTokenStore.push(refreshToken);
            const userID = userLoginSuccess.userID;
            res.json({userID, token: accessToken, refreshToken: refreshToken});
        }else{
            res.status(401).json({error:'Login Failed'});
        }
    }else{
        res.status(400).json({error: `Missing Input - ${loginCredentialsValid.message}`});
    }
});


app.post('/register', async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    const registrationInputValid = validateRegistrationInput(username,email,password);
    if(registrationInputValid.value)
    {
        let db_user = await GetUserByUsernameEmail(username, email);
        if(db_user.length === 0){
            await InsertUser(username,password,email);
            res.sendStatus(200);
        }else{
            res.status(401).json({error:'User Already Exists'}).send();
        }

    }else{
        res.status(400).json({error: `${registrationInputValid.message}`});
    }
});

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
    console.log(`validation request: ${JSON.stringify(req.body)}`);
    console.log(`body.token: ${req.body.token}, token: ${req.token}`);
    const token = req.body.token;
    if(token == null){
        console.log(`Token was null, returning 401`);
        return res.sendStatus(401);
    } 
    //We should check in DB for token
    if(!accessTokenStore.includes(token)) {
        console.log(`token ${token} does not exist, returning 403`);
        return res.sendStatus(403);
    } 

    jwt.verify(token, process.env.ACCESS_TOKEN, (err,user)=>{
        if(err){
            console.log(`JWT verification failed. Err: ${err}`);
            res.status(403)
            return res.send(JSON.stringify({err: err}));
        } 
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

function validateOrigin(origin) {
    const allowedOrigins = ['http://127.0.0.1:5501', 'http://127.0.0.1:5000', 'http://127.0.0.1:5000', 
    'http://localhost:5000', 'http://wordgame-qa.af-south-1.elasticbeanstalk.com', 'https://www.tomsportfolio.co.za', 'http://thatwordgame.af-south-1.elasticbeanstalk.com',
    'http://thatwordgameqa-als-env.eba-uqjvqey9.af-south-1.elasticbeanstalk.com'];
        if (allowedOrigins.includes(origin)){
            return true;
        } else {
            console.log(`CORS blocked with origin: ${origin}`)
            return false;
        }
    }
    
app.listen(port, ()=>{
    console.log(`Listening on localhost:${port}`);
});
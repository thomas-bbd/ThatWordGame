/**
 * This server only handles user authentication
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();

//Allow us to read body requests as JSON
app.use(express.json()); 

//Refresh Token Storage for Testing
//NB -> DO NOT DO IN PROD
let refreshTokenStore = [];

// //For Testing API Access
// const posts = [{name: 'Kyle', posts: '1'}, {name: 'John', posts: '2'}]

// //Use middleware to verify token before allowing access to API
// app.get('/posts', authenticateToken, (req,res) =>{
//     res.json(posts.filter(post => post.name === req.user.name));
// });

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

app.post('/login', (req,res)=>{
    //TO DO: Authenticate user using ARGON2
    const username = req.body.username;
    const password = req.body.password;
    //Payload to Serialize
    const userPayload = {name: username};
    //Sign JWT
    const accessToken = generateAccessToken(userPayload);
    //Create associated refresh token
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN);
    //Push our refresh token to the db/store
    refreshTokenStore.push(refreshToken);
    res.json({token: accessToken, refreshToken: refreshToken});

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


/**
 * Token Authentication Middleware
 * -> This function is called before the logic of our
 *    route is executed
 * 
 * -> It then calls 'next' to hand authentication back to the calling function
*/

// function authenticateToken(req,res,next){
//     //Get Token from Auth Header from [BEARER Token]
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
    
//     //Tell client that there is no token
//     if(token == null){
//         return res.sendStatus(401);
//     }

//     //Verify the token recieved against our secret
//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, user)=>{
//         //In the event of a valid token sent a HTTP 403
//         if(err) return res.sendStatus(403);

//         /*
//         If our token is valid, we set out user from the JWT 
//         to a user parameter in the request and call next
//         to hand control back to our calling route
//         */

//         req.user = user;
//         next();
//     });
// }

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '30s'});
}


app.listen(port, ()=>{
    console.log(`Listening on localhost:${port}`);
});
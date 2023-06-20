/**
 * This Server is for demo/testing
 * It will make requests to AuthServer and Verify Tokens
 * which handles login and token management
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 8080;
require('dotenv').config();

//Allow us to read body requests as JSON
app.use(express.json()); 

//For Testing API Access
const posts = [{name: 'Kyle', posts: '1'}, {name: 'John', posts: '2'}]

//Use middleware to verify token before allowing access to API
app.get('/posts', authenticateToken, (req,res) =>{
    res.json(posts.filter(post => post.name === req.user.name));
});

// /**
//  * login Logic
//  * -> We recieve a login request from our client
//  * -> We validate username and password
//  * -> We issue a token
//  */

// app.post('/login', (req,res)=>{
//     //TO DO: Authenticate user using ARGON2
//     const username = req.body.username;
//     const password = req.body.password;
//     //Payload to Serialize
//     const user = {name: username};
//     //Sign JWT
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
//     res.json({token: accessToken});

// });

/**
 * Token Authentication Middleware
 * -> This function is called before the logic of our
 *    route is executed
 * 
 * -> It then calls 'next' to hand authentication back to the calling function
*/

function authenticateToken(req,res,next){
    //Get Token from Auth Header from [BEARER Token]
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    //Tell client that there is no token
    if(token == null){
        return res.sendStatus(401);
    }

    //Verify the token recieved against our secret
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user)=>{
        //In the event of a valid token sent a HTTP 403
        if(err) return res.sendStatus(403);

        /*
        If our token is valid, we set out user from the JWT 
        to a user parameter in the request and call next
        to hand control back to our calling route
        */

        req.user = user;
        next();
    });
}


app.listen(port, ()=>{
    console.log(`Listening on localhost:${port}`);
});
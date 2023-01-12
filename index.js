/*
*******************************************************
*******************************************************
***               JSON WEB TOKEN                    ***
***               NODEJS Implementaion              ***
*******************************************************
*******************************************************
 */

// Import external package express and jsonwebtoken
const express = require('express');
const jwt = require('jsonwebtoken');

// Secret key string for jwt token
const secrettoken = "secrettoken33";

const app = express();

// Testing route
app.get('/',(req, res)=>{
    res.json('API is working....');
});

// Login route to generate token 
app.post('/login',(req, res)=>{

// Payload data for the token creation
    const user = {
        id:1,
        name:'vinit',
        email:'vinit@gmail.com'
    }

// Create token using jwt sign method 
// By defalut algoritham H256 & expiration time in milisecond 
    jwt.sign({user}, secrettoken, {expiresIn:'300s'},(error, token)=>{
        res.json({
            token
        });
    })
   
});

// Middleware function for accessing token from the headers of req 'authorization'
const verifyToken = (req, res, next)=>{

// Extract token form req.headers 'authorization'
    const bearerheader = req.headers['authorization'];

// Checking token is defined or undefinded    
    if(typeof bearerheader !== 'undefined'){

// Split the 'authorization using space to get bearer token that set from client side'
        const bearer = bearerheader.split(' ');
        const token = bearer[1];

// Set the token into the request in as req.token        
        req.token = token;

        // Move handle to next  
        next();
    }
    else{
        res.send('Authoriztion token not found.');
    }
}

// Route accepting the request with middleware function verifyToken
app.post('/profile',verifyToken, (req, res)=>{

    // Verify the token with same secret key 
    jwt.verify(req.token, secrettoken,(error,authdata)=>{
        if(error){
            res.send({result:"Invalid token"});
        }
        else{
            res.send({success:'Successfully user login', authdata});
        }
    })
});

// Server listen at port 5000 in localhost
app.listen(5000,()=>{
    console.log('Server running at port 5000');
})
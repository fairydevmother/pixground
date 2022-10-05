const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = (req,res, next)=>{
    bcrypt.hash(req.body.password, 10 , function(err, hashedPass){
        if(err){
            res.json({
                error: err
            })
        }
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        })
    });
    user= new User({
        name: req.body.name,
        email: req.body.email,
        password:hashedPass
    })
    user.save()
    .then(user=> {
        res.json({
            message: 'User added'
        })
    })
    .catch(error=>{
        res.json({
            message: "An error occured"
        })
    })
}

const login = (req, res, next) =>{
    exports.login = async (req, res, next) => {

        const { username, password } = req.body;
        
        // Validate  & password
        
        if (!username || !password) {
        
        return next(new ErrorResponse("Please provide an email and password", 400));
        
        }
        
        // Check for user
        
        const user = await User.findOne({ username }).select("+password");
        
        if (!user) {
        
        return next(new ErrorResponse("Invalid credentials", 401));
        
        }
        
        // Check if password matches
        
        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
        
        return next(new ErrorResponse("Invalid credentials", 401));
        
        }
        
        const token = user.getSignedJwtToken();
        
        const id = user.getId();
        
        res.status(200).json({success: true, token, id})
        
        }
}



const refreshToken = (req,res, next)=>{
   jwt.verify(refreshToken,'refreshtokensecret',function(err,decode){
    if(err){
        res.status(400).json({
            err
        })
    }
    else {
        let token = jwt.sign({name:decode.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_SECRET_TIME});
        let refreshToken = req.body.refreshToken
        res.status(200).json ({
            message: "Token refreshed successfully!",
            token,
            refreshToken
        }) 
    }   
   })
}





module.exports = {
    register, login, refreshToken
}
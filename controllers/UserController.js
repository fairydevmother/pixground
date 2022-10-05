const User = require('../models/User');

//Show users
const getUsers = (req, res, next)=>{
    User.find()
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

const getUser = (req, res, next) =>{
    let UserId = req.body.userId
    User.findById(userId)
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
        
    })
}

//Add user
const store = (req, res, next) => {
    let user = new User({
        username: req.body.name,
        email: req.body.email,
        password:req.body.password
        
    })
    user.save()
    .then(response =>{
        res.json({
            message: 'user added'
        })
    })
    .catch(error =>{
        res.json({
            message: 'An error occured!'
        })
    })
}


//Update user
const updateUser = (req, res, next)=>{
    let UserId = req.body.UserId

    let updatedData = new {
        username: req.body.name,
        email: req.body.email,
        password:req.body.password
        
    }
    User.findByIdAndUpdate(UserId, {$set: updatedData})
    .then(()=>{
        res.json({
            message: 'User updated.'
        })
    })
    .catch(error =>{
        res.json({
            message: 'An error occured'
        })
    })
}


// Delete user
const deleteUser = (req, res, next)=>{
    let UserId = req.body.UserId
    User.findByIdAndRemove(UserId)
    .then(()=>{
        req.json({
            message: 'User deleted.'
        })
    })
    .catch(error =>{
        req.json({
            message: 'An error occured!'
        })
    })
}

module.exports = {
    getUser, getUsers, store, updateUser, deleteUser
}
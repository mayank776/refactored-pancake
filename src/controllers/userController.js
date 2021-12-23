const {userModel} = require("../models");

const {validator, jwt} = require("../utils")

const bcrypt = require("bcrypt")

const registerUser = async (req,res) => {
    try{

        let requestBody = req.body;

        // whether the request body has been entered or not
        if(!validator.isValidRequestBody(requestBody)){
            return res.status(400).send({status:"Failure", msg:"enter valid request body"})
        }

        // object destruccturing
        let {username, email, phone, password} = requestBody

        // whether no field is empty
        if(!validator.isValid(username)){
            return res.status(400).send({status:"Failure", msg:"enter the username"})
        }

        if(!validator.isValid(email)){
            return res.status(400).send({status:"Failure", msg:"enter the email"})
        }

        if(!validator.validateEmail(email)){
            return res.status(400).send({status:"Failure", msg:"enter a valid email"})
        }

        // make sure email stays unique
        const isEmailAlreadyPresent = await userModel.findOne({email:email})

        if(isEmailAlreadyPresent){
            return res.status(400).send({status:"Failure", msg:`${isEmailAlreadyPresent.email} already registered, try new one!`})
        }

        if(!validator.isValid(phone)){
            return res.status(400).send({status:"Failure", msg:"enter the phone number"})
        }

        if(!validator.validatePhone(phone)){
            return res.status(400).send({status:"Failure", msg:"enter a valid phone number"})
        }

        // phone should be unique
        const isPhoneAlreadyPresent = await userModel.findOne({phone:phone})

        if(isPhoneAlreadyPresent){
            return res.status(400).send({status:"Failure", msg:`${isPhoneAlreadyPresent.phone} already registered, try a new one!` })
        }

        if(!validator.isValid(password)){
            return res.status(400).send({status:"Failure", msg:"enter the password"})
        }

        if (!validator.validPassword(password)) {
            return res.status(400).send({ status: false, msg: "password length should be more than 8" });
        }

        // encrypting the password using "bcrypt" library
        let saltRounds = 10;
        let salt = await bcrypt.genSalt(saltRounds);
        let hash = await bcrypt.hash(password, salt);

        password = hash;

        const newUser = {username, email, phone, password}

        const userCreated = await userModel.create(newUser)

        res.status(201).send({status:"Success", user:userCreated})

    }catch(err){
        res.status(500).send({status:"Failure", msg:err.message})
    }
}

const loginUser = async (req,res) => {
    try{
        let requestBody = req.body;

        if(!validator.isValidRequestBody(requestBody)){
            return res.status(400).send({status:"Failure", msg:"enter the request body"})
        }

        const { email, password} = requestBody

        if(!validator.isValid(email)){
            return res.status(400).send({status:"Failure", msg:"enter the email"})
        }

        if(!validator.validateEmail(email)){
            return res.status(400).send({status:"Failure", msg:"enter a valid email"})
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: "enter a password" });
        }
        
        const user = await userModel.findOne({ email });
      
        if (!user) {
            return res.status(401).send({ status: false, msg: "user not registered" });
        }
      
        // DECRYPTING PASSWORD
        let isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
        return res.status(401).send({ status: false, msg: "user credentials does not match" });
        }

        // CREATING TOKEN
        const token = await jwt.createToken({ userId: user._id });

        res.header("Authorization", token);

        res.status(201).send({ status: true, message: `successful login`, data: { token } });

    }catch(err){
        res.status(500).send({status:"Failure", msg:err.message})
    }
}

// admin api

const verifedUser = async(req,res) => {
        let userId = req.params.user

        let user = await userModel.findById(userId)

        if(!user){
            return res.status(404).send({status:"failure", msg:"user not found"})
        }

        console.log(user)
        let verifiedUser = await userModel.findOneAndUpdate({_id:userId}, {$set: {verified:true}}, {new:true})

        res.status(200).send({status:"Success", data:verifiedUser})
}


module.exports = {
    registerUser, 
    loginUser,
    verifedUser
}
const express = require("express")
const app = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config/keys")
const isLogin = require("../middleware/login")



app.post("/signup", (req, res)=> {
    const {name, email, password, photo} = req.body
    if(!email || !password || !name)
{  
      res.status(422).json({error:"Please fill all the fields"})
}    
    User.findOne({email: email})
    .then((savedUser)=> {
        if(savedUser){
  res.status(422).json({error:"User already exist with that email"})
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword=> {
            const user = new User({
                email,
                password: hashedpassword,
                name,
                photo
            })
            user.save()
            .then(user=> {
                res.json({message: "Successfully Registered"})
            })
            .catch(err=> {
                console.log(err);
            })
        })

    })
    .catch(err=> {
        console.log(err)
    })
});

app.post("/login", (req, res)=> {
    const {email, password} = req.body
    if(!email || !password){
      return  res.status(422).json({error:"Please enter all details"})
    }
    User.findOne({email:email})
    .then(savedUser=> {
        if(!savedUser){
          return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(isEqual=> {
              if(isEqual){
                //   res.json({message: "Successfully signed in"})
        
             const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
             const {_id, name, email, followers, following,photo} = savedUser
             res.json({token, user:{_id, name, email, followers, following, photo}})
            }
              else{
                return  res.status(422).json({error:"Invalid email/password"})
              }
          })
          .catch(err=> {
              console.log(err);
          })
        
    })
})




    
module.exports = app    

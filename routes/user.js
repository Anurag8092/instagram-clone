const { response } = require("express")
const express = require("express")
const app = express.Router()
const mongoose = require("mongoose")
const Post = mongoose.model("Post")
const isLogin = require("../middleware/login")
const User = mongoose.model("User")


app.get("/user/:id", isLogin, (req, res)=> {
    User.findOne({_id: req.params.id})
    .select("-password")   //we want all details of the user excluding password
    .then(user=> {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, foundPosts)=> {
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user, foundPosts})  //this will send user and foundPosts to the frontend
        })
    }).catch(err=> {
        return res.status(404).json({error: "User not found"})
    })
})

//folower/following
app.put("/follow", isLogin,  (req, res)=> {
    User.findByIdAndUpdate(req.body.followId, {
        $push:{followers: req.user._id}
    }, {
        new:true
    }, (err, result)=> {
        if(err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        }, {
            new: true
        }).select("-password").then(result=> {
            res.json(result)
        }).catch(err=> {
            return res.status(422).json({error: err})
        })
    })
})

app.put("/unfollow", isLogin,  (req, res)=> {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull:{followers: req.user._id}
    }, {
        new:true
    }, (err, result)=> {
        if(err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.unfollowId}
        }, {
            new: true
        }).select("-password").then(result=> {
            res.json(result)
        }).catch(err=> {
            return res.status(422).json({error: err})
        })
    })
})



app.put("/updatephoto", isLogin, (req, res)=> {
    User.findByIdAndUpdate(req.user._id, {
        $set:{
            photo:req.body.photo
        }
    }, {
        new: true
    },
     (err, result)=> {
        if(err){
            return res.status(422).json({error:"Photo cannot be posted....Please try again!"})           
        }else{
            res.json(result)
        }
    })

})


// app.post("/searchuser", (req, res)=> {
//     let userPattern = new RegExp("^"+req.body.query)
//     User.find({email:{$regex:userPattern}})
//     .select("_id email")
//     .then(user=> {
//         res.json({user})
//     }).catch(err=> {
//         console.log(err);
//     })
// })




module.exports = app
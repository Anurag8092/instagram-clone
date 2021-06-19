const express = require("express")
const app = express.Router()
const mongoose = require("mongoose")
const Post = mongoose.model("Post")
const isLogin = require("../middleware/login")


//Home
app.get("/allposts", isLogin, (req, res)=> {
    Post.find()
    //.populate("which value you want to populate", "select which values to show")
    .populate("postedBy", "_id name") //will expand and show all the details of user instead of only ObjectId
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")    //posts which were made at last should be shown at the top
    .then(foundPosts => {
        res.json({foundPosts})
    })
    .catch(err=> {
        console.log(err);
    })
})

//Upload Post
app.post("/createpost", isLogin, (req, res)=> {
    const {title, body, photo} = req.body
    if(!title || !body || !photo){
        res.status(422).json({error: "Please insert all fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo,
        postedBy:req.user
    })
    post.save().then(result=> {
        res.json({post: result})
    })
    .catch(err=> {
        console.log(err);
    })
})


//User Profile
app.get("/profile", isLogin, (req, res)=> {
    Post.find({postedBy: req.user.id})
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .then(userPosts=> {
        res.json({userPosts})
    })
    .catch(err=> {
        console.log(err);
    })
})



//Like Posts
app.put("/like", isLogin, (req, res)=> {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result)=> {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


//Unlike Posts
app.put("/unlike", isLogin, (req, res)=> {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result)=> {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})



//Comments
app.put("/comment", isLogin, (req, res)=> {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments: comment}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result)=> {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


//Delete Post
app.delete("/delete/:postId", isLogin, (req, res)=> {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, foundPost)=> {
        if(err || !foundPost){
            return res.status(422).json({error: err})
        }
        if(foundPost.postedBy._id.toString() === req.user._id.toString()){
            foundPost.remove()
            .then(result=> {
                res.json(result)
            }).catch(err=> {
                console.log(err);
            })
        }
    })
})




//get follower posts
app.get("/getfollowingpost", isLogin, (req, res)=> {

Post.find({postedBy:{$in: req.user.following}})  //check postedBy present in following
    //.populate("which value you want to populate", "select which values to show")
    .populate("postedBy", "_id name") //will expand and show all the details of user instead of only ObjectId
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt") 
    .then(foundPosts => {
        res.json({foundPosts})
    })
    .catch(err=> {
        console.log(err);
    })
})


module.exports = app
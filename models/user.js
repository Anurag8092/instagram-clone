const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo:{
        type: String,
        default: "https://res.cloudinary.com/anurag-cloud/image/upload/v1624124820/nodDP_xxvrlp.png"
    },
    followers: [{type:ObjectId, ref:"User"}],
    following: [{type:ObjectId, ref:"User"}]
});
mongoose.model("User", userSchema);
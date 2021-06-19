const mongoose = require("mongoose")
const express = require("express");
const { MONGOURI } = require("./config/prod");
const app = express()
const PORT = process.env.PORT || 5000



mongoose.connect("mongodb+srv://admin-anurag:angel123@cluster0.esyec.mongodb.net/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//Middleware
require("./models/user")
require("./models/post")

app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))



if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"))
    const path = require("path")
    app.get("*", (req, res)=> {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}


//Start Server
app.listen(PORT, (req, res)=> {
console.log("Server is Up and running on 5000");
})
const mongoose = require('mongoose');
require('dotenv').config()

const User = new mongoose.Schema({

    googleId:String,
    displayName:String,
    image:String,

    username:{
        type: String,
        // required: true,
        unique: true
    },
    email:{
        type: String,
        // required: true,
        unique: true,
    },
    password:{
        type: String,
        // required: true,
    },
    address:{
        type: String,
    },
    avatar:{
        type: String,
        default:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png",
    },
    role:{
        type: String,
        default: "user",
        enum: ["admin", "user"] 
    },
    favourites:[{
        type: mongoose.Types.ObjectId,
        ref: "books",
    }],
    cart:[{
        type: mongoose.Types.ObjectId,
        ref: "books",
    }],
    orders:[{
        type: mongoose.Types.ObjectId,
        ref: "order",
    }],
    
},
{ timestamps: true}
);


module.exports = mongoose.model("user", User);


require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(uri,{});
const con =  mongoose.connection;
con.once("open", ()=>{
    console.log("MongoDb databasse connection establish seccessfully.")
})
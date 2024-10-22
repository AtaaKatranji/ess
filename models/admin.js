const db = require('../config/db');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const { Schema } = mongoose;


// Define schema for Admin table
const adminSchema = new Schema({
    name: { type: String, required: true , minlength: 3,maxlength: 50 },
    phoneNumber: { type: String, required: true,unique: true,
      lowercase: true,
      trim: true,
      },
    password: { type: String, required: true,minlength: 8 },
    // role: { type: String, required: true },
    // birthday: { type: Date, required: true },
    // address: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
  });

// used while encrypting user entered password
adminSchema.pre("save",async function(){
    var admin = this;
    if(!admin.isModified("password")){
        return
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(admin.password,salt);
        admin.password = hash;
    }catch(err){
        throw err;
    }
});
//used while signIn decrypt
adminSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log('----------------no password',this.password);
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};


  
const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;
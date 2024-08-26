const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
class UserServices{
    

    static async registerUser(name,phoneNumber,password){
        try{
                console.log("-----Email --- Password-----",name,phoneNumber,password);
                
                const createUser = new UserModel({name,phoneNumber,password});
                return await createUser.save();
        }catch(err){
            throw err;
        }
    }
    static async getUserByPhoneNumber(phoneNumber){
        try{
            return await UserModel.findOne({phoneNumber});
        }catch(err){
            console.log(err);
        }
    }
    static async getUserById(userId){
        try{
            console.log(UserModel.findOne({userId}));
            return await UserModel.findOne({userId});
        }catch(err){
            return err;
        }
    }

    static async checkUser(phoneNumber){
        try {
            console.log("in checker func "+phoneNumber);
            return await UserModel.findOne({phoneNumber:phoneNumber});
            
        } catch (error) {
            throw error;
        }
    }
    static async generateAccessToken(tokenData,JWTSecret_Key,JWT_EXPIRE){
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }
}
module.exports = UserServices;
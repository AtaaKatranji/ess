const UserModel = require('../models/user.model');
const UserServices = require('../services/user_services');

exports.register = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { name, phoneNumber, institutionKey, password } = req.body;
        const duplicate = await UserServices.getUserByPhoneNumber(phoneNumber);
        if (duplicate) {
            throw new Error(`UserName ${phoneNumber}, Already Registered`)
        }
        const response = await UserServices.registerUser(name, phoneNumber,institutionKey, password);

        res.json({ status: true, success: 'User registered successfully' });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

exports.login = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request query:', req.query);
        console.log('Request params:', req.params);
        
        var phoneNumber = req.body.phoneNumber;
        var password = req.body.password;
        console.log("PhoneNumber after assign it", phoneNumber);
        console.log("Password after assign it", password);

        if (!phoneNumber || !password) {
            throw new Error('Parameter are not correct');
        }
        let user = new UserModel() 
        user = await UserServices.checkUser(phoneNumber);
        console.log(user);
        if (!user) {
            throw new Error('User does not exist');
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (isPasswordCorrect === false) {
            throw new Error(`Password does not match`);
        }

        // Creating Token
        console.log("before generate token")
        let tokenData;
        tokenData = { _id: user._id, phoneNumber: user.phoneNumber,name:user.name,institutionKey:user.institutionKey };
    

        const token = await UserServices.generateAccessToken(tokenData,process.env.JWT_SECRET,"1d")
        console.log(user._id)
        console.log(token)
        res.status(200).json({ status: true, success: "sendData", token: token });
    } catch (error) {
        console.log(error, 'err---->');
        res.status(500).json({ status: false, message: error.message });
    }
}

exports.show = async (req, res, next) => {
    try{
        const {id}= req.body;
        console.log(id);
        const response = await UserServices.getUserByPhoneNumber(id);
        res.status(200).json({ status: true, success: "sendData", res: response });
    }catch(err){
        console.log(err);
        next(err);
    }
}
exports.test = async (req, res, next) => {
    try{
        
        const response = await UserServices.Test();
        res.status(200).json({ status: true, success: "sendData", res: response });
    }catch(err){
        console.log(err);
        next(err);
    }
}
// Get all users
exports.getAllUsersOfInstitution = async (req, res) => {
    const { institutionKey } = req.body;
    try {
      const users = await UserModel.find({ institutionKey });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  };

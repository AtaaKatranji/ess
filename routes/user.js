const express = require("express");
const router = express.Router();
const { Employee } = require("../models/schmeaESS");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



//just for testing 
router.get("/api/test", async (req, res) =>{
  const result = {"Ataa":"test"};
  res.json({ result })
})



//get all users
router.get("/api/getAllEmployee", async (req, res) =>{
  const result = await Employee.find(); 
  res.json({ result })
})
  
  //register
  router.post("/api/register", async (req,res)  =>{
    console.log("In register");
    console.log(req.body);
  try {
  const hashedPassword = await bcrypt.hash(req.body.password,10);
  const edata = new Employee ({
    
    "name": req.body.name,
    "phoneNumber": req.body.phoneNumber,
    "password": hashedPassword,
    // "role": req.body.role,
    // "birthday" : req.body.birthday,
    // "address" : req.body.address,
  });

  await edata.save(); //save employee in dataBase
  
 
  
  res.status(200).send({
      "status-code": 200,
      "message": "Employee added Successfully",
      "Employee": edata
  });
  } catch (error) {
      res.status(200).send({
          "status-code": 501,
          "message": error,
          
  });
}
  })
  //login
  router.post("/api/login", async (req, res) => {

    try {
       let { phoneNumber, password } = req.body;
       let employee = await Employee.findOne({ phoneNumber });
       
      if(!(employee)) {
        return res.status(401).send("Phone Number not exited")
      }
      const passwordMatch = await bcrypt.compare(password, employee.password);
      const token = jwt.sign({ userId: user._id }, 'secret_key'); 
      console.log(passwordMatch);
      if (passwordMatch) {
        //  const token = jwt.sign({ userId: user._id }, 'secret_key');  // Token generation
        //  res.status(200).json({ token });
        let tokenData;
        tokenData = { _id: user._id, email: user.email };
    
        const token = await UserServices.generateAccessToken(tokenData,"secret","1h")
         res.status(200).json({ status: true, success: "sendData", token: token })
        return res.status(201).send({
         "message" :  `Success, Welcome Back Mr.${employee.name}`,
         "employee" : employee
          
        });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
      // const token = await employee.generateToken();
      // res.json({ token });
    } catch (err) {
      res.status(501).json({ message: err.message });
    }
  });
  //
  router.get("/api/show/:userId", async (req,res)=> {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) return res.status(401).send('Unauthorized');
      res.status(200).json({ message: `Hello user ${decoded.userId}` });
  });
  })
  //
  router.get('/protected', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(401).send('Unauthorized');
        res.status(200).json({ message: `Hello user ${decoded.userId}` });
    });
  });

 

  module.exports = router;
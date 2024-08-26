const express = require("express");
const router = express.Router();
const { Product } = require("../models/schmeaESS");


//post api
router.post("/api/add_product", (req,res)=>{
    console.log("Result", express.json.toString(req.body));
    
    const pdata = new Product({
        
      "name": req.body.name,
      "price": req.body.price,
      "desc" : req.body.desc

  });
    pdata.save();
  
    res.status(200).send({
        "status-code": 200,
        "message": "Product added Successfully",
        "Product": pdata
    });
});
//get api 
router.get("/api/getAll",async (req,res) => {
  const result = await Product.find(); 
  res.json({ result })
})

module.exports = router;
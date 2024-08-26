const express = require("express");
const { Employee, Product } = require("./models/schmeaESS");


require("./config/db")
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/products');
const checksRoutes = require('./routes/apis');
const test = require("./routes/user.routes");
const todo = require("./routes/toDo_apis");

app.use('/test',test);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/checks', checksRoutes);
app.use('/todolist', todo);

//const hostname = '192.168.1.109'; // for Home's wifi
const hostname = '192.168.1.103'; // for wifi
//const hostname = '192.168.48.138'; // for hotspot my mobile

const port = 9000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/",(req, res)=>{
  res.send("Hello in 9000")
});


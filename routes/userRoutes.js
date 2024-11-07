// const router = express.Router();
// const User = require("../models/employee");

// router.post("/register", async (req, res) => {
//     try {
//       const { name, email, password, roles } = req.body;
//       const user = new User({ name, email, password, roles });
//       await user.save();
//       res.status(201).json({ message: "User registered successfully" });
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });
  
//   router.post("/login", async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ email });
//       if (!user || !(await user.comparePassword(password))) {
//         return res.status(401).json({ message: "Invalid email or password" });
//       }
//       const token = await user.generateToken();
//       res.json({ token });
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });
//   module.exports = router;

const router = require("express").Router();
const UserController = require('../controllers/user.controller');
router.post("/register",UserController.register);
router.post("/login", UserController.login);
router.get("/show", UserController.show);
router.get("/api", UserController.test);
module.exports = router;
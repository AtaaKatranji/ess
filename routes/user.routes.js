const router = require("express").Router();
const { 
    getAllUsersOfInstitution,
    register,
    login,
    show,
    test
 } = require('../controllers/user.controller');
router.post("/register",register);
router.post("/login", login);
router.get("/show", show);
router.get("/api", test);
router.post("/listUsers",getAllUsersOfInstitution)
module.exports = router;
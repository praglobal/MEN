const router = require("express").Router();

const {Register,Login, logout, forgotPassword,resetPassword,getUserDetalis,updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteProfileAdmin} = require ("../controller/userController.js");
const {isAuthnticateUser,authorizeRoles} = require("../middleware/auth");

router.post("/signup",Register);
router.post("/signin",Login);
router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:token",resetPassword);
router.get("/me",isAuthnticateUser,getUserDetalis);
router.put("/updatePassword",isAuthnticateUser,updatePassword);
router.put("/updateProfile",isAuthnticateUser,updateProfile);
router.get("/logout",logout);

//Admin

router.get("/admin",isAuthnticateUser,authorizeRoles("admin"),getAllUsers);
router.get("/admin/:id",isAuthnticateUser,authorizeRoles("admin"),getSingleUser);
router.put("/admin/:id",isAuthnticateUser,authorizeRoles("admin"),updateUserRole);
router.delete("/admin/:id",isAuthnticateUser,authorizeRoles("admin"),deleteProfileAdmin);

module.exports = router;
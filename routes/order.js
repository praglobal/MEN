const router = require("express").Router();
const {isAuthnticateUser,authorizeRoles} = require("../middleware/auth");
const {addOrders, getOrder, getMyOrders, getAllOrders,updateOrderStatus,deleteOrder} =require("../controller/orderController");

router.get("/me",isAuthnticateUser,getMyOrders);
router.post("/",isAuthnticateUser,addOrders);

// Admin
router.get("/admin",isAuthnticateUser,authorizeRoles("admin"),getAllOrders);
router.get("/:id",isAuthnticateUser,authorizeRoles("admin"),getOrder);
router.put("/admin/:id",isAuthnticateUser,authorizeRoles("admin"),updateOrderStatus);
router.delete("/admin/:id",isAuthnticateUser,authorizeRoles("admin"),deleteOrder);

module.exports = router;
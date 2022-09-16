const { addProduct, getProducts, updateProduct,deleteProduct, singleProduct, addReview, deleteReview, getAllReview } = require("../controller/productController");
const {isAuthnticateUser,authorizeRoles} = require("../middleware/auth");
const router = require("express").Router();

//Reviews
router.put("/review",isAuthnticateUser,addReview);

//delete Reviews
router.delete("/deleteReview",isAuthnticateUser,deleteReview);

//get Reviews
router.get("/reviews",getAllReview);

//Add Products
router.post("/",isAuthnticateUser,authorizeRoles("admin"),addProduct);

//update Products
router.put("/:id",isAuthnticateUser,authorizeRoles("admin"),updateProduct);

//delete Products
router.delete("/:id",isAuthnticateUser,authorizeRoles("admin"),deleteProduct);

//Get Products
router.get("/",isAuthnticateUser,getProducts);

//Get single product
router.get("/:id",isAuthnticateUser,singleProduct);



module.exports = router;
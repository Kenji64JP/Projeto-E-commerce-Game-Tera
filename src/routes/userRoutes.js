const express = require("express");
const router = express.Router();

const controllers = require("../controllers/userControllers");
const authController = require("../controllers/authControllers")

router.get("/all", authController.checkToken, controllers.getAll);
router.get("/:id", controllers.getUserById);
router.post("/create", controllers.createUser);
router.post("/login", authController.login)
router.put("/update/:id", controllers.updateUserById);
router.delete("/delete/:id", controllers.deleteUserById)

module.exports = router
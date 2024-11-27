const express = require('express')

const middlewares = require("../middleware/index")
const userController = require("../controllers/user.controller.js")

const router = express.Router();

router.post("/api/signup", middlewares.verifySignUp, userController.createUser);
router.post("/api/signin", userController.signIn);

router.get("/api/user/:id", middlewares.verifyToken, userController.findUserById);
router.get("/api/user", middlewares.verifyToken, userController.findAll);
router.put("/api/user/:id", middlewares.verifyToken, userController.updateUserById);
router.delete("/api/user/:id", middlewares.verifyToken, userController.deleteUserById);

module.exports = router;

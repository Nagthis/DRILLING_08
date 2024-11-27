const express = require('express')

const middlewares = require("../middleware/index")
const bootcampController = require("../controllers/bootcamp.controller.js")

const router = express.Router();

//RUTA CONSULTAR TODOS LOS USUARIOS
router.post("/api/bootcamp", middlewares.verifyToken, bootcampController.createBootcamp);
router.post("/api/bootcamp/adduser", middlewares.verifyToken, bootcampController.addUser);
router.get("/api/bootcamp/:id", middlewares.verifyToken, bootcampController.findById);
router.get("/api/bootcamp", bootcampController.findAll);

module.exports = router;

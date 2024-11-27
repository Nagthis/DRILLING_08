const express = require("express");
const cors = require("cors");

const db = require('./app/models')
const userRoutes = require("./app/routes/user.routes.js");
const bootcampRoutes = require("./app/routes/bootcamp.routes.js");

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//endpoints
app.use("/", userRoutes);
app.use("/", bootcampRoutes);


app.all("*", (req, res) => {
  res
    .status(404)
    .json({ code: 404, message: "El recurso al que intenta acceder no existe." });
});

const PORT = 3000;
const main = async () => {
  try {
      await db.sequelize.authenticate();
      await db.sequelize.sync({ force: false, alter: false });
      app.listen(PORT, () => {
          console.log("Servidor escuchando en puerto: " + PORT);
      });
  } catch (error) {
      console.log("Ha ocurrido un error: ", error);
  }
};

main();
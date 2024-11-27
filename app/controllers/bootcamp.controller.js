const {
  users,
  bootcamps
} = require('../models')
const db = require('../models')
const Bootcamp = db.bootcamps
const User = db.users

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = (req, res) => {
  // Validar el request
  if (!req.body.title || !req.body.cue || !req.body.description) {
    res.status(400).json({
      code: 400,
      message: "Los campos son requeridos  y no vacios! (title, cue y description)"
    })
    return;
  }

  const bootcamp = {
    title: req.body.title,
    cue: req.body.cue,
    description: req.body.description
  }

  return Bootcamp.create(bootcamp)
    .then(bootcamp => {
      res.status(200).json({
        code: 200,
        message: "OK",
        data: bootcamp
      })        
    })
    .catch(err => {
      res.status(500).json({
        code: 500,
        message: err.message || "Error al crear el bootcamp.",
      })         
    })
}

// Agregar un Usuario al Bootcamp
exports.addUser = (req, res) => {
  // Validar el request
  if (!req.body.idBootcamp || !req.body.idUser) {
    res.status(400).json({
      code: 400,
      message: "Los campos son requeridos y no vacios!"
    })
    return;
  }

  const bootcampId = req.body.idBootcamp
  const userId = req.body.idUser

  return Bootcamp.findByPk(bootcampId)
    .then((bootcamp) => {
      if (!bootcamp) {
        return res.status(400).json({
          code: 400,
          message: "Bootcamp no encontrado",
        })   
      }

      return User.findByPk(userId).then((user) => {
        if (!user) {
          return res.status(400).json({
            code: 400,
            message: "Usuario no encontrado",
          })   
        }
        
        bootcamp.addUser(user)
          .then((_data) => {
            res.status(200).json({
              code: 200,
              message: "OK",
              data: bootcamp
            })  
          })
    })
    .catch((err) => {
      res.status(500).json({
        code: 500,
        message: err.message || "Error mientras se estaba agregando Usuario al Bootcamp.",
      })       
    });
  });
}

// obtener los bootcamp por id 
exports.findById = (req, res) => {
  const id = req.params.id;

  return Bootcamp.findByPk(id, {
      include: [{
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName"],
        through: {
          attributes: [],
        }
      }, ],
    })
    .then(data => {
      if (!data) {
        return res.status(404).json({
          code: 404,
          message: "Bootcamp no encontrado.",
        })
      }
      res.status(200).json({
        code: 200,
        message: "OK",
        data
      })
    })
    .catch(err => {
      res.status(500).json({
        code: 500,
        message: err.message || "Error mientras se encontraba el bootcamp.",
      })      
    })
}

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = (_req, res) => {
  return Bootcamp.findAll({
    include: [{
      model: User,
      as: "users",
      attributes: ["id", "firstName", "lastName"],
      through: {
        attributes: [],
      }
    }, ],
  }).then(data => {
    res.status(200).json({
      code: 200,
      message: "OK",
      data
    })  
  }).catch((err) => {
    res.status(500).json({
      code: 500,
      message: err.message || "Error Buscando los Bootcamps.",
    })
  });
}
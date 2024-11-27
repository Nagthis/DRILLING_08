const bcrypt  = require ('bcryptjs'); 
const jwt = require ('jsonwebtoken');

const db = require('../models')
const User = db.users
const Bootcamp = db.bootcamps
const authConfig = require('../config/auth.config')

// Crear y Guardar Usuarios
exports.createUser = (req, res) => {
  // Validar el request
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    res.status(400).json({
      code: 400,
      message: "Los campos son requeridos  y no vacios! (firstName, lastName, email, password)"
    })
    return;
  }

  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password)
  };

  return User.create(user)
    .then(data => {
      res.status(201).json({
        code: 201,
        message: "OK",
        data: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        code: 500,
        message: err.message || "Algun error ha ocurrido en la creación del usuario.",
      })
    })
}

// Iniciar sesión
exports.signIn = (req, res) => {
  // Validar el request
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      code: 400,
      message: "Los campos son requeridos  y no vacios! (email, password)"
    })
    return;
  }

  return User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'password'],
      where: {
        email: req.body.email
      }
      }).then((data) => {
        if (data.length == 0) {
          return res.status(400).json({
              code: 400,
              message: "Combinacion usuario y contrasena invalidos",
          }); 
        }

        const usuario = data[0]

        bcrypt.compare(req.body.password, usuario.password, function(err, result) {
          if (err || !result) {
            return res.status(400).json({
              code: 400,
              message: "Combinacion usuario y contrasena invalidos",
            });             
          }

          let token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                usuario,
            },
            authConfig.SECRET
          );

          res.status(200).json({
            code: 200,
            message: "OK",
            data: {
              firstName: usuario.firstName,
              lastName: usuario.lastName,
              email: usuario.email,
              accessToken: token
            }
          })
        })
    })
}
// obtener los bootcamp de un usuario
exports.findUserById = (req, res) => {
  const id = req.params.id;

  return User.findByPk(id, {
      attributes: ['id', 'firstName', 'lastName', 'email'],
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        }
      }, ],
    })
    .then(data => {
      if (!data) {
        return res.status(404).json({
          code: 404,
          message: "Usuario no encontrado.",
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
        message: err.message || "Error mientras se encontraba el usuario.",
      })
    })
}

// obtener todos los Usuarios incluyendo los bootcamp
exports.findAll = (_req, res)  => {
  return User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'email'],
    include: [{
      model: Bootcamp,
      as: "bootcamps",
      attributes: ["id", "title"],
      through: {
        attributes: [],
      }
    }, ],
  })
  .then(data => {
    res.status(200).json({
      code: 200,
      message: "OK",
      data
    })      
  })
  .catch(err => {
    res.status(500).json({
      code: 500,
      message: err.message || "Error mientras se encontraban los usuarios.",
    })
  })  
}

// Actualizar usuarios
exports.updateUserById = (req, res) => {
  const id = req.params.id;

  // Validar el request
  if (!req.body.firstName && !req.body.lastName) {
    res.status(400).json({
      code: 400,
      message: "Necesitas enviar al menos 1 campo. (firstName y/o lastName)"
    })
    return;
  }

  const user = {};

  if (req.body.firstName) {
    user.firstName = req.body.firstName
  }
  if (req.body.lastName) {
    user.lastName = req.body.lastName
  }

  return User.update({
      firstName: user.firstName,
      lastName: user.lastName
    }, {
      where: {
        id
      }
    })
    .then(data => {
      if (data != 1) {
        return res.status(404).json({
          code: 404,
          message: "Usuario no encontrado.",
        })        
      }

      return res.status(200).json({
        code: 200,
        message: "OK",
      })       
    })
    .catch(err => {
      res.status(500).json({
        code: 500,
        message: err.message || "Error mientras se actualizaba el usuario",
      })      
    })
}

// Eliminar usuarios
exports.deleteUserById = (req, res) => {
  const id = req.params.id;

  return User.destroy({
      where: {
        id
      }
    })
    .then(data => {
      if (!data) {
        return res.status(404).json({
          code: 404,
          message: "Usuario no encontrado.",
        })
      }      

      return res.status(204).json({
        code: 204,
        message: "OK",
      })  
    })
    .catch(err => {
      res.status(500).json({
        code: 500,
        message: err.message || "Error mientras se eliminaba el usuario.",
      })        
    })
}
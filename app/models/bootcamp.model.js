module.exports = (sequelize, DataTypes) => {
  const Bootcamp = sequelize.define('bootcamp', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "El campo nombre (title) es requerido"
        },
      },
    },
    cue: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Números de CUE es necesario, minimo 5 y máximo 20"
        },
        isInt: {
          args: true,
          msg: "Debes introducir un número entero"
        },
        max: 20,
        min: 5,
      },
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Se debe introducir una descripción"
        },
      },
    }

  })

  return Bootcamp
}
const db = require('../models')
const User = db.users

module.exports = (req, res, next) => {
    const email = req.body.email
    
    if (!email) {
        return res.status(400).json({
            code: 400,
            message: "El email proporcionado es invalido.",
        });        
    }
    
    return User.findAll({
        where: {
          email: email
        }
    }).then((data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                code: 400,
                message: "El email proporcionado ya fue usado.",
            }); 
        }

        next();
    }) 
}
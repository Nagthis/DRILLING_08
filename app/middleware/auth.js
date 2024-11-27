const jwt = require ('jsonwebtoken');
const db = require('../models')
const User = db.users

const authConfig = require('../config/auth.config')

exports.verifyToken = verifyToken = (req, res, next) => {
    let baseUrl = req.baseUrl;
    let { token } = req.params;
    let authorization = req.headers.authorization;
    if (!token) {
        try {
            token = authorization.split(" ")[1];
            if (!token) {
                throw new Error("sin token");
            }
        } catch (error) {
            if (baseUrl.includes("api")) {
                return res.status(400).json({
                    code: 400,
                    message: "Debe proporcionar un token para acceder.",
                });
            } else {
                return res.status(400).json({
                    code: 400,
                    message: "Debe proporcionar un token para acceder.",                    
                });
            }
        }
    }

    jwt.verify(token, authConfig.SECRET, async (error, decoded) => {
        let hostname = req.hostname;
        if (error) {
            
            if (hostname.includes("api")) {
                return res.status(401).json({
                    code: 401,
                    message: "El token proporcionado es inválido.",
                });                
            } else {
                return res.status(401).json({
                    code: 401,
                    message: "El token proporcionado es inválido.",
                });                
            }
        }
        let datosUsuarioToken = decoded.usuario;
        
        return User.findByPk(datosUsuarioToken.id).then((usuario) => {
            usuario = usuario.toJSON();
            req.usuario = usuario;
            next();            
        }).catch((err) => {
            return res.status(401).json({
                code: 401,
                message: "El token proporcionado es inválido.",
            });            
        });
    });
};

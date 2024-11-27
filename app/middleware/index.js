const verifySignUp = require('./verifySignUp')
const auth = require('./auth')

let middlewares = {
    verifySignUp: verifySignUp,
    verifyToken: auth.verifyToken,
};

module.exports = middlewares

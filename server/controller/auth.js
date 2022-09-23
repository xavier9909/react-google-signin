
const jwt = require('jsonwebtoken');
const Login = require('../models/loginModel');
const secretkey = require('../config/secret.json');

const authenticateUser = async (req, res, next) => {
    let idToken = req.cookies['login'];

    try {
        const decodedMessage = jwt.verify(idToken, secretkey.key);
        await Login.findOne({
            email: decodedMessage
        });
        next();
    }
    catch (e) {
        res.status(401).send({
            error: e
        })
    }
}

module.exports = { authenticateUser };
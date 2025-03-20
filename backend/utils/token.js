// utils/token.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const { email, username, role, name,userId } = user;
    const token = jwt.sign({ email, username, role, name,userId }, process.env.JSON_SECRETKEY);
    return token;
};

module.exports = generateToken;

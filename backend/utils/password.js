// utils/password.js
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 12);  // Salt rounds of 12
    return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
};

module.exports = { hashPassword, comparePassword };

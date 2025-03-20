const Role = require('../models/Role')



const getUserRole = async (req,res,next) => {
    const {userId} = req.user
    try {
        const {role} = await Role.findOne({ userId });
        res.status(200).json(role=='admin');
    } catch (error) {
        res.status(500).json('error');
    }
};
module.exports = {
    getUserRole
};
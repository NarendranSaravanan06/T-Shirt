const express=require('express')
const { getUsers, getUserById, updateUser}=require('../controllers/userController')
const authMiddleware = require('../middlewares/authorize')
const adminMiddleware = require('../middlewares/admin')
const route=express.Router()

route.post('/update',authMiddleware,updateUser)
route.get('/:id',authMiddleware,getUserById)
route.get('/',authMiddleware,adminMiddleware,getUsers)
route.get('/role',authMiddleware,adminMiddleware)
module.exports=route
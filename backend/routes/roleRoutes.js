const express=require('express')
const { getUserRole}=require('../controllers/roleController')
const authMiddleware = require('../middlewares/authorize')
const route=express.Router()

route.get('/',authMiddleware,getUserRole)

module.exports=route
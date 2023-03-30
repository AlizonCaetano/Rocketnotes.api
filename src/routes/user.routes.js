const { Router } = require('express')
const userRoutes = Router()

const UserController = require('../controllers/UserController')
const userController = new UserController()

const AvatarController = require('../controllers/AvatarController')
const avatarController = new AvatarController()

const ensuranceAuthenticated = require('../middlewares/ensuranceAuthenticated')

const uploadConfig = require('../config/upload')
const multer = require('multer')
const upload = multer(uploadConfig.MULTER)

userRoutes.post('/', userController.create)
userRoutes.put('/', ensuranceAuthenticated, userController.update)
userRoutes.patch('/avatar', ensuranceAuthenticated, upload.single('avatar'), avatarController.update)

module.exports = userRoutes
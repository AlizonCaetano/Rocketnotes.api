const { Router } = require('express')
const tagsRoutes = Router()

const TagsController = require('../controllers/TagsController')
const tagsController = new TagsController()

const ensuranceAuthenticated = require('../middlewares/ensuranceAuthenticated')


tagsRoutes.get('/', ensuranceAuthenticated, tagsController.index)

module.exports = tagsRoutes
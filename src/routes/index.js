const { Router } = require('express')
const routes = Router()

const userRoutes = require('./user.routes.js')
const notesRoutes = require('./notes.routes.js')
const tagsRoutes = require('./tags.routes.js')
const sessionsRoutes = require('./sessions.routes')


routes.use('/users', userRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/notes', notesRoutes)
routes.use('/tags', tagsRoutes)

module.exports = routes

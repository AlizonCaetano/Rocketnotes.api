require('dotenv/config')

require('express-async-errors')
const AppError = require('./utils/AppError.js')

const migrationsRun = require('./database/sqlite/migrations')

const cors = require('cors')
const express = require('express')
const app = express()
const routes = require('../src/routes')

app.use(express.json())
app.use(cors())

const uploadConfig = require('./config/upload')
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

migrationsRun()

app.use(routes)

app.use((error, request, response, next)=>{
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        }) 
    }

    return response.status(500).json({
        status: 'error',
        message: `Internal server error | Message:${error.message}`
    })
})

const PORT = 5000
app.listen(PORT, ()=>{ console.log(`Server running on port ${PORT}`)})
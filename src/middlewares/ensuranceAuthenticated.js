const AppError = require('../utils/AppError')
const { verify } = require('jsonwebtoken')
const authConfig = require('../config/auth')

async function ensuranceAuthenticated(req, res, next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        throw new AppError('JWT token not exists', 401)
    }    
    const [, token ] = authHeader.split(' ')


    try{
        const { sub: user_id } = verify(token, authConfig.jwt.secret)
        req.user = {
            id: Number(user_id)
        }

        return next()
    }catch{
        throw new AppError('JWT token incorrect', 401)
    }
}

module.exports = ensuranceAuthenticated
const { hash, compare } = require('bcryptjs')

const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UserController{
    async create(req, res){
        const { name, email, password } = req.body

        const database = await sqliteConnection()
        const checkEmailExists = await database.get('SELECT * FROM users WHERE email = (?)',
        [email])

        if(checkEmailExists){
            throw new AppError('User already exists')
        }

        const hashedPassword = await hash(password, 8)

        await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword])
            
        return res.status(201).json()
    }

    async update(req, res){
        const { name, email, password, old_password } = req.body
        const user_id = req.user.id

        const database = await sqliteConnection()
        const user = await database.get('SELECT * FROM users WHERE id = (?)', [user_id])

        if(!user){
            throw new AppError('Users not exists!')
        }

        const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError('Email is already in use!')
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !old_password){
            throw new AppError('Old password is required')
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)
            if(!checkOldPassword){
                throw new AppError('Old password doesnt match')
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
        [user.name, user.email, user.password, user_id])

        return res.json()
    }
}

module.exports = UserController
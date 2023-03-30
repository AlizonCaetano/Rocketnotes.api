const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')
const AppError = require('../utils/AppError')

class AvatarController{
    async update(req, res){
        const avatarFilename = req.file.filename
        const user_id = req.user.id

        const user = await knex('users').where({id:user_id}).first()
        if(!user){
            throw new AppError('Only auth users can update avatar', 401)
        }

        const diskStorage = new DiskStorage()

        if(user.avatar){
            await diskStorage.deleteFile(avatarFilename)
        }

        const filename = await diskStorage.saveFile(avatarFilename)
        user.avatar = filename

        await knex('users').update(user).where({ id: user_id })

        return res.json(user)
    }
}

module.exports = AvatarController
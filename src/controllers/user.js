const query = require('../model/query')
const { rows } = require('../../database/pg')
const {sign, verify} = require('../../function/jwt')
const { v4 } = require('uuid')
const path = require('path')


const uploadsDir = path.join(__dirname, "../../static/images")
console.log(uploadsDir);

const signup = async (req, res) => {

    const {name, surname, email, password, role, subject} = req.body
    const checkUser = await rows(query.CHECK_EMAIL, email)
    
    if (checkUser.length > 0) {        
        res.send({message: "Bu email oldin ro'yhatdan o'tgan!"})
    }
    else {
        try {
            const {photo} = req.files
            
            const imgName = v4() + "." + photo.mimetype.split("/")[1]
            photo.mv(path.join(uploadsDir, imgName), (error) => {
                if(error) {
                    console.log(error)
                }
            })
            
            let user = await rows(query.SIGNUP, name.toLowerCase(), surname, email, password, role, subject, imgName)
            
            const [{user_id, userrole, username}] = user
            const accessToken = sign({user_id, userrole, username})
            return res.send({accessToken, message: "Ro'yhatdan o'tdingiz"}).status(200)
    
        } catch (error) { 
            const img = "teacher.png"  
            let user = await rows(query.SIGNUP, name.toLowerCase(), surname, email, password, role, subject, img)

            const [{user_id, userrole, username}] = user
            const accessToken = sign({user_id, userrole, username})
            return res.send({accessToken, message: "Ro'yhatdan o'tdingiz"}).status(200)
        }
    }
}


const login = async (req, res) => {
    const { email, password } = req.body
    const foundUser = await rows(query.LOGIN, email, password)
    
    if (foundUser.length > 0) {
        const [{user_id, userrole, username}] = foundUser
        const accessToken = sign({user_id, userrole, username})
        res.send({accessToken, message: "Kirish amalga oshdi"})
    } else {
        res.send({message: "Email yoki parol xato"})
    }
}


module.exports = {
    signup,
    login,
}
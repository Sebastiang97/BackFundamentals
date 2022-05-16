const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { jwtSecret } = require("./config")

class JsonWebToken {
    async 

    createToken(payload){
        const token = jwt.sign(payload,jwtSecret,{
            expiresIn:'7d'
        })
        return token
    }

    async encrypt(string){
        try{
            const salt = await bcrypt.genSalt()
            const hash = await bcrypt.hash(string,salt)

            return hash
        }catch(error){
            console.log(error)
        }
    }
    async compare(string,hash){
        return await bcrypt.compare(string,hash)
    }
}

module.exports = JsonWebToken
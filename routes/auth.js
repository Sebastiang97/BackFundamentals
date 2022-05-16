const express = require("express")
const view = require("../helpers/views")
const database = require("../libs/database")
const JsonWebToken = require('../helpers/jwtSecret')
const router = express.Router()
const jwt = new JsonWebToken()


router.get("/login",async(req,res)=>{
    return view("login.html",res)
})

router.get("/signup",async(req,res)=>{
    return view("registro.html",res)
})

router.post("/api/login",async(req,res)=>{
    try{
        const {email,password} = req.body

        const query = `SELECT * FROM users WHERE email = '${email}' `
        const [data] = await database.query(query)
        const compare = await jwt.compare(password,data.password)
        if(!compare){
            return res.status(401).json({
                status: 401,
                error:true,
                message: 'invalid credentials'
            })
        }
        const {name} = data
        return res.json({
            status: 201,
            name: data.name,
            email: data.email,
            token: jwt.createToken({name,email})
        })
    }catch(error){
        return res.status(400).json({
            status: 400,
            error:true,
            message:"An error ocurred"
        })
    }
})

router.post("/api/signup",async (req,res)=>{
    try{ 
        const {name,email,password} = req.body
        const pass = await jwt.encrypt(password)

        const query = `INSERT INTO users VALUES('','${name}','${email}','${pass}')`
        const {insertId} = await database.query(query)
        
        return res.status(201).json({
            status: 201,
            id:insertId,
            name,
            email,
            password,
            token: jwt.createToken({name,email})
        })
    }catch(error){
        return res.status(400).json({
            status: 400,
            error:true,
            message: error.message
        })
    }
    // Hacer una query para registrar un usuario
    // Investigar como hacer un INSERT INTO en mysql2
})

module.exports = router 

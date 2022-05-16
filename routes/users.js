const express = require("express")
const database = require("../libs/database")
const JsonWebToken = require('../helpers/jwtSecret')
const router = express.Router()
const jwt = new JsonWebToken()

router.get("/api/users",async (req,res)=>{
    try{
        const data = await database.query("SELECT * FROM users")

        return res.status(200).json({
            status: 200,
            data
        })
    }catch(error){
        return res.status(400).json({
            status: 400,
            error:true,
            message: error.message
        })
    }
    
})

router.post("/api/users",async (req,res)=>{
    try{ 
        const {name,email,password} = req.body
        const pass = await jwt.encrypt(password)

        const query = `INSERT INTO users VALUES('','${name}','${email}','${pass}')`
        const {insertId} = await database.query(query)

        // const query = `INSERT INTO users VALUES (NULL, ?, ?, ?)`
        // const data = await database.connection.execute(query,[name,email,pass])
        // console.log(data) 
        // return res.status(201).json({
        //     status: 201,
        //     values,
        //     token: jwt.createToken({name,email})
        // })
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
})

router.put("/api/users/:id",async (req,res)=>{
    try{
        const {name,email,password} = req.body
        const {id} = req.params
        const pass = await jwt.encrypt(password)

        const query = `UPDATE users SET name ='${name}', email = '${email}', password ='${pass}' WHERE id = ${id}`
        const {affectedRows} = await database.query(query)

        if(affectedRows){
            return res.status(200).json({
                status: 200,
                name,
                email,
                password,
                token: jwt.createToken({name,email})
            })
        }
        res.status(400).json({
            status: 400,
            error:true,
            message_error: `El registro ${id} no existe`
        })
    }catch(error){
        return res.status(400).json({
            status: 400,
            error:true,
            message: error.message
        })
    }
    
})

router.delete("/api/users/:id",async (req,res)=>{
    try{
       const {id} = req.params
        const {affectedRows} = await database.query(`DELETE FROM users WHERE id = ${id}`)
        if(affectedRows ){
            res.status(200).json({
               status: 200,
               data_delete: "ok"
           })
        }
        res.status(400).json({
            status: 400,
            error:true,
            message_error: `El registro ${id} no existe`
        })
    }catch(error){
        return res.status(400).json({
            status: 400,
            error:true,
            message: error.message
        })
    }
    
})

module.exports = router 
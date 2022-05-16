const express = require("express")
const database = require("../libs/database")
const router = express.Router()

router.get("/api/events",async (req,res)=>{
    try{
        const data = await database.query("SELECT * FROM events")

        return res.status(200).json({
            status:200,
            data
        })
    }catch(error){
        return res.status(400).json({
            status:400,
            error:true,
            message:"An error ocurred"
        })
    }
    
})

router.get("/api/events/:id",async (req,res)=>{
    try{
        const {id} = req.params
        const [data] = await database.query(`SELECT * FROM events WHERE id = ${id}`)
        const users = await database.query(`SELECT * FROM events_users WHERE event_id = ${id}`)

        if(data){
            data.guests = users.map(user=> ({
                    id:user.guest_id,
                    name:user.guest_name
                })
            )
            return res.status(200).json({
                status:200,
                data
            })
        }
        return res.status(400).json({
            status:400,
            error: 'no se encontro datos con el id '+id
        })
        
    }catch(error){
        return res.json({
            error:true,
            message:"An error ocurred"
        })
    }
    
})

router.post("/api/events",async (req,res)=>{
    try{ 
        //const query = `INSERT INTO events VALUES (NULL, '${fecha}', '${zona_horaria}', '${hora_inicio}', '${hora_final}', '${titulo}', '${descripcion}', '${tarea_titulo}', '${tarea_descripcion}');`
        const query = `INSERT INTO events VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?,?,?);`
        const {values} = await database.connection.execute(query, Object.values(req.body))
        
        return res.status(201).json({
            status: 201,
            values
        })
    }catch(error){
        return res.status(400).json({
            status: 400,
            error:true,
            message: error.message
        })
    }
})

router.post("/api/events/assign",async (req,res)=>{
    try{ 
        
        const query = `INSERT INTO VALUES (NULL, ?, ?)`
        const {values} = await database.connection.execute(query, Object.values(req.body))
        console.log(values)
        return res.status(201).json({
            status: 201,
            values
        })
    }catch(error){
        return res.status(400).json({
            status: 400,
            error:true,
            message: error.message
        })
    }
})

router.put("/api/events/:id",async (req,res)=>{
    try{ 
        const id = req.params.id
        const query = `UPDATE events SET fecha = ?, zona_horaria = ?, hora_inicio = ?, hora_final = ?, titulo = ?, descripcion = ?, tarea_titulo = ?, tarea_descripcion = ? WHERE id = ${id}`
        
        const {values} = await database.connection.execute(query, Object.values(req.body))
        return res.status(201).json({
            status: 201,
            update_data:req.body
        })
        
    }catch(error){
        return res.status(200).json({
            status: 200,
            error:true,
            message: error.message
        })
    }
})

router.delete("/api/events/:id",async (req,res)=>{
    try{
        const id = req.params.id
        const {affectedRows} = await database.query(`DELETE FROM events WHERE id = ${id}`)
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
//Usando modulos nátivos:
const path = require("path") // path: nos permite admistrar rutas de archivos

//Usando modules externos
const cors = require('cors')
const express = require("express")
const port = 4000

//Importando router
const users = require("./routes/users") 
const auth = require("./routes/auth")
const events = require("./routes/events")
const app = express()


//Sección para los middleware
app.use(express.json())
app.use(cors({
    origin: '*'
}))
app.use("/static",express.static(path.join(__dirname,"static"))) //Middleware para archivos estaticos


// Sección de codigo para los router
app.use(users) // Usando un router
app.use(auth)
app.use(events)


// req: request(peticion) y res: response(respuesta)
app.get("/",function(req,res){
    console.log(__dirname) // Ubicación o ruta de nuestro proyecto
    return res.sendFile(path.join(__dirname,"views","index.html"))
})

app.listen(port,()=>{
    console.log("Escuchando en: http://localhost:"+port)
})
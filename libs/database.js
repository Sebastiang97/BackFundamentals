const mysql = require("mysql2")
require("dotenv").config()

const connection = mysql.createConnection({
    // host:'127.0.0.1', 
    // port: 3306,
    // user: 'root',
    // password: '',
    // database: 'OrganizerApp'
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

})

function query(sql){
    const miPromesa = new Promise(function (resolve,reject){
        connection.query(sql,function(error,result,fields){
            if(error!=null){
                return reject({
                    error:true,
                    message:error.sqlMessage
                })
            }else{
                return resolve(result)
            }
        })
    })

    return miPromesa
}


module.exports = {
    connection,
    query
}



// CREATE TABLE `organizerapp`.`users` ( `id` INT(30) NOT NULL , `name` VARCHAR(100) NOT NULL , `email` VARCHAR(100) NOT NULL , `password` VARCHAR(100) NOT NULL , PRIMARY KEY (`id`), UNIQUE (`email`)) ENGINE = InnoDB;


// CREATE TABLE `events` ( 
//     `id` INT(30) NOT NULL AUTO_INCREMENT ,
//     `fecha` DATE NOT NULL , 
//     `zona_horaria` VARCHAR(100) NOT NULL , 
//     `hora_inicio` TIME NOT NULL , 
//     `hora_final` TIME NOT NULL ,
//     `organizer_id` INT(30) NOT NULL ,
//     `organizer_name` INT(30) NOT NULL ,
//     `titulo` VARCHAR(100) NOT NULL , 
//     `descripcion` VARCHAR(200) NOT NULL , 
//     `invitados` VARCHAR(100) NOT NULL , 
//     `tarea_titulo` VARCHAR(100) NOT NULL , 
//     `tarea_descripcion` VARCHAR(200) NOT NULL , 
//     FOREIGN KEY (organizer_id) REFERENCES users (id),
//     PRIMARY KEY (`id`)
//     )

// CREATE TABLE events_users (
//     id INT(30) NOT NULL AUTO_INCREMENT ,
//     event_id INT(30) NOT NULL,
//     organizer_id INT(30) NOT NULL,
//     organizer_name INT(30) NOT NULL,
//     guest_id INT(30) UNIQUE NOT NULL,
//     guest_name INT(30) NOT NULL,
//     PRIMARY KEY (id),
//     FOREIGN KEY (event_id) REFERENCES events (id),
//     FOREIGN KEY (guest_id) REFERENCES users (id)
// );

// INSERT INTO `events_users` VALUES (NULL, '11', '25', '26');
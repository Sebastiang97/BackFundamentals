# Proyecto De administrador de tares

## archivos necesarios para ejecutar el proyecto

para instalar las dependencia necesarias

npm i 

cree el documento .env y asigne las variables de acuerdo a su base de datos, tiene un ejemplo en el documento .en.example, cualquier error revise el documento /libs/database.js

Añade las tablas Users, events y events_users

En este orden 

 CREATE TABLE users ( 
 `id` INT(30) AUTO_INCREMENT,
 `name` VARCHAR(100) NOT NULL , 
 `email` VARCHAR(100) NOT NULL , 
 `password` VARCHAR(100) NOT NULL , 
 PRIMARY KEY (`id`), 
 UNIQUE (`email`)
 )
 
 
 CREATE TABLE `events` ( 
     `id` INT(30) NOT NULL AUTO_INCREMENT ,
     `fecha` DATE NOT NULL , 
     `zona_horaria` VARCHAR(100) NOT NULL , 
     `hora_inicio` TIME NOT NULL , 
     `hora_final` TIME NOT NULL ,
     `organizer_id` INT(30) NOT NULL ,
     `organizer_name` INT(30) NOT NULL ,
     `titulo` VARCHAR(100) NOT NULL , 
     `descripcion` VARCHAR(200) NOT NULL , 
     `invitados` VARCHAR(100) NOT NULL , 
     `tarea_titulo` VARCHAR(100) NOT NULL , 
     `tarea_descripcion` VARCHAR(200) NOT NULL , 
     FOREIGN KEY (organizer_id) REFERENCES users (id),
     PRIMARY KEY (`id`)
    )
 
 CREATE TABLE events_users (
     id INT(30) NOT NULL AUTO_INCREMENT ,
     event_id INT(30) NOT NULL,
     organizer_id INT(30) NOT NULL,
     organizer_name INT(30) NOT NULL,
     guest_id INT(30) UNIQUE NOT NULL,
     guest_name INT(30) NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (event_id) REFERENCES events (id),
     FOREIGN KEY (guest_id) REFERENCES users (id)
 );


## Ejecuta el proyecto

para ejecutar el proyecto 
npm run dev 





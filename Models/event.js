const database = require('../libs/database')

class Event {
  constructor(data) {
    if (data) {
      this.fecha = data.fecha
      this.zona_horaria = data.zona_horaria
      this.hora_inicio = data.hora_inicio
      this.hora_final = data.hora_final
      this.organizer_id = data.organizer_id
      this.titulo = data.titulo
      this.descripcion = data.descripcion
      this.tarea_titulo = data.tarea_titulo
      this.tarea_descripcion = data.tarea_descripcion
      this.invitados = data.usuarios_asignados
      this.desasignados = data.usuarios_desasignados
      this.data = data
    }
  }

  validate() {
    if (
      !(
        this.fecha &&
        this.zona_horaria &&
        this.hora_inicio &&
        this.hora_final &&
        this.organizer_id &&
        this.titulo &&
        this.descripcion &&
        this.tarea_titulo &&
        this.tarea_descripcion
      )
    ) {
      return {
        message: 'Debes completar todos los campos',
        validated: false,
      }
    }

    if (this.titulo.length < 3) {
      return {
        message: 'titulo debe tener mas de 3 caracteres',
        validated: false,
      }
    }

    return {
      validated: true,
    }
  }

  async getById(id) {
    try {
      const result = await database.query(
        `SELECT * FROM events JOIN events_users ON events.id = events_users.event_id WHERE events_users.event_id = ${id}`
      )
      const organizer_id = await this.getOrganizer(result[0].organizer_id)
      for (let i = 0; i < result.length; i++) {
        delete result[i].id
        delete result[i].guest_id
        delete result[i].organizer_id
      }
      const users = await this.getAllGuest(id)
      const data = {
        status: 200,
        id: result[0].event_id,
        fecha: result[0].fecha,
        zona_horaria: result[0].zona_horaria,
        hora_inicio: result[0].hora_inicio,
        hora_final: result[0].hora_final,
        organizer_id: organizer_id,
        titulo: result[0].titulo,
        descripcion: result[0].descripcion,
        tarea_titulo: result[0].tarea_titulo,
        tarea_descripcion: result[0].tarea_descripcion,
        invitados: users,
      }
      return data
    } catch (error) {
      return {
        status: 400,
        message: 'El id del evento no existe',
      }
    }
  }

  async getOrganizer(id) {
    try {
      const [result] = await database.query(
        `SELECT * FROM users WHERE id = ${id}`
      )

      return result
    } catch (error) {
      return {
        status: 400,
        message: 'El id del organizador no existe',
      }
    }
  }

  async save() {
    try {
      const { affectedRows, insertId } = await database.query(
        `INSERT INTO events VALUES (NULL,'${this.fecha}','${this.zona_horaria}','${this.hora_inicio}','${this.hora_final}','${this.organizer_id}','${this.titulo}','${this.descripcion}','${this.tarea_titulo}','${this.tarea_descripcion}')`
      )
      if (affectedRows) {
        this.data.id = insertId
        return {
          event: this.data,
          status: 200,
          success: true,
          message: 'Evento registrado correctamente',
        }
      }

      // return {
      //   error: true,
      //   message: 'Evento no se registrado ',
      // }
    } catch (error) {
      return error
    }
  }

  async getAllGuest(id) {
    try {
      const result = await database.query(
        `SELECT * FROM users JOIN events_users ON users.id = events_users.guest_id WHERE events_users.event_id = ${id}`
      )
      for (let i = 0; i < result.length; i++) {
        delete result[i].id
        delete result[i].password
        delete result[i].event_id
      }
      return result
    } catch (error) {
      return {
        status: 400,
        message: 'El id del evento no existe',
      }
    }
  }

  async assign(id) {
    delete this.data.usuarios_Invitados
    let event = {
      event: this.data,
      invitados_insertados: [],
    }
    try {
      const guests = await this.getAllGuest(id)
      for (let i = 0; i < this.invitados.length; i++) {
        const verify = guests.some(
          ({ guest_id }) => guest_id == this.invitados[i].id
        )
        if (!verify) {
          const { affectedRows } = await database.query(
            `INSERT INTO events_users VALUES(NULL,${id},${this.invitados[i].id})`
          )
          if (affectedRows) {
            event.invitados_insertados.push(this.invitados[i])
          }
        }
      }
      event.invitados = guests
      if (event.invitados_insertados.length > 0) {
        event.message = `Usuarios asignados ${event.invitados_insertados.length} correctamente`
        return event
      }
      event.message = `Los usuarios en la solicitud ya estan invitados`
      return event
    } catch (error) {
      return {
        status: 400,
        message: 'El id del evento no existe',
      }
    }
  }

  async unassign(id) {
    try {
      this.data.desasignados = []
      const guests = await this.getAllGuest(id)
      for (let i = 0; i < this.desasignados.length; i++) {
        const verify = guests.some(
          ({ guest_id }) => guest_id == this.desasignados[i].id
        )
        const { affectedRows } = await database.query(
          `DELETE FROM events_users WHERE guest_id = ${this.desasignados[i].id} AND event_id = ${id}`
        )
        if (affectedRows) {
          this.data.desasignados.push(this.desasignados[i])
        }
      }

      this.data.invitados = guests
      this.data.status = 200
      this.data.message = `Usuarios desasignados correctamente ${this.data.desasignados.length}`
      return this.data
    } catch (error) {
      return {
        status: 400,
        message: 'El id del evento no existe',
      }
    }
  }

  async update(id) {
    const data = {
      name: this.name,
      email: this.email,
      password: await this.encrypt(this.password),
    }
    try {
      const { affectedRows } = await database.query(
        `UPDATE users SET name ='${this.name}', email = '${this.email}', password ='${this.pass}' WHERE id = ${id}`
      )
      if (affectedRows) {
        return {
          user: data,
          status: 200,
          success: true,
          message: 'Usuario actulizado correctamente',
        }
      }

      return {
        status: 400,
        success: false,
        message: 'No se encontro al usuario con el id ' + id,
      }
    } catch (error) {
      return error
    }
  }

  async delete(id) {
    try {
      const { affectedRows } = await database.query(
        `DELETE FROM users WHERE id = ${id}`
      )
      if (affectedRows) {
        return {
          status: 200,
          success: true,
          message: 'Usuario borrado correctamente',
        }
      }
      return {
        status: 400,
        success: false,
        message: 'No se encontro al usuario con el id ' + id,
      }
    } catch (error) {
      return error
    }
  }
}

module.exports = Event

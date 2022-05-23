const database = require('../libs/database')
const bcrypt = require('bcrypt')

class User {
  constructor(data) {
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.data = data
  }

  validate() {
    if (!(this.email && this.name && this.password)) {
      return {
        message: 'Debes completar todos los campos',
        validated: false,
      }
    }
    if (this.name.length < 3) {
      return {
        message: 'Username debe tener mas de 3 caracteres',
        validated: false,
      }
    }

    return {
      validated: true,
    }
  }

  async save() {
    const pass = await this.encrypt(this.password)
    try {
      const { affectedRows, insertId } = await database.query(
        `INSERT INTO users VALUES('','${this.name}','${this.email}','${pass}')`
      )
      if (affectedRows) {
        delete this.data.password
        this.data.id = insertId

        return {
          user: this.data,
          status: 200,
          success: true,
          message: 'Usuario registrado correctamente',
        }
      }
    } catch (error) {
      return error
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
        delete data.password
        data.id = id
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

  async encrypt(string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(string, salt)

    return hash
  }

  async compare(string, hash) {
    return await bcrypt.compare(string, hash)
  }
}

module.exports = User

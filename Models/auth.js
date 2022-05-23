const database = require('../libs/database')
const bcrypt = require('bcrypt')

class Auth {
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
        status: 400,
      }
    }
    if (this.name.length < 3) {
      return {
        message: 'Username debe tener mas de 3 caracteres',
        validated: false,
        status: 400,
      }
    }

    return {
      validated: true,
    }
  }

  async save() {
    const data = {
      name: this.name,
      email: this.email,
      password: await this.encrypt(this.password),
    }
    try {
      const result = await database.query(
        `INSERT INTO users VALUES('','${this.name}','${this.email}','${this.password}')`
      )

      delete data.password
      data.id = result.insertId

      return {
        user: data,
        status: 200,
        message: 'Usuario registrado correctamente',
      }
    } catch (error) {
      return {
        status: 400,
        error: true,
        message: error.message,
      }
    }
  }

  async login() {
    const result = await database.query(
      `SELECT * FROM users WHERE email = '${this.email}'`
    )

    const user = result[0]
    if (user) {
      if (await this.compare(this.password, user.password)) {
        delete user.password
        return {
          success: true,
          user,
          status: 201,
          message: 'Usuario correcto',
        }
      } else {
        return {
          success: false,
          status: 400,
          message: 'Credenciales incorrectas',
        }
      }
    }

    return {
      success: false,
      status: 400,
      message: 'Usuario no registrado',
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

module.exports = Auth

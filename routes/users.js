const express = require('express')
const database = require('../libs/database')
const JsonWebToken = require('../helpers/jwtSecret')
const router = express.Router()
const jwt = new JsonWebToken()
const User = require('../Models/user')

router.get('/api/users', async (req, res) => {
  try {
    const data = await database.query('SELECT * FROM users')

    return res.status(200).json({
      status: 200,
      data,
    })
  } catch (error) {
    return res.status(400).json({
      status: 400,
      error: true,
      message: error.message,
    })
  }
})

router.post('/api/users', async (req, res) => {
  const user = new User(req.body)
  const validation = user.validate()
  if (validation.validated) {
    const result = await user.save()
    return res.json(result)
  }
  return res.status(400).json(validation)
  // try {
  //   const { name, email, password } = req.body
  //   const pass = await jwt.encrypt(password)

  //   const query = `INSERT INTO users VALUES('','${name}','${email}','${pass}')`
  //   const { insertId } = await database.query(query)

  //   return res.status(201).json({
  //     status: 201,
  //     id: insertId,
  //     name,
  //     email,
  //     password,
  //     token: jwt.createToken({ name, email }),
  //   })
  // } catch (error) {
  //   return res.status(400).json({
  //     status: 400,
  //     error: true,
  //     message: error.message,
  //   })
  // }
})

router.put('/api/users/:id', async (req, res) => {
  const user = new User(req.body)
  const validation = user.validate()
  if (validation.validated) {
    const result = await user.update(req.params.id)
    return res.json(result)
  }
  return res.status(400).json(validation)
})

router.delete('/api/users/:id', async (req, res) => {
  const user = new User(req.body)
  const result = await user.delete(req.params.id)
  if (result) {
    return res.status(200).json(result)
  }
  return res.status(400).json(result)
})

module.exports = router

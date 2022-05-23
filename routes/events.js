const express = require('express')
const database = require('../libs/database')
const router = express.Router()
const Event = require('../Models/event')
const view = require('../helpers/views')

router.get('/api/events', async (req, res) => {
  try {
    const data = await database.query('SELECT * FROM events')

    return res.status(200).json({
      status: 200,
      data,
    })
  } catch (error) {
    return res.status(400).json({
      status: 400,
      error: true,
      message: 'An error ocurred',
    })
  }
})

router.get('/api/events/:id', async (req, res) => {
  const event = new Event(null)
  const result = await event.getById(req.params.id)
  return res.json(result)
})

router.get('/detail', async (req, res) => {
  return view('detalles.html', res)
})

router.post('/api/events', async (req, res) => {
  const event = new Event(req.body)
  const validation = event.validate()

  if (validation.validated) {
    const result = await event.save()
    return res.json(result)
  }
  return res.json(validation)
})

router.post('/api/events/assign/:id', async (req, res) => {
  const event = new Event(req.body)
  const validation = event.validate()

  if (validation.validated) {
    const result = await event.assign(req.params.id)
    return res.json(result)
  }
  return res.json(validation)
})

router.post('/api/events/unassign/:id', async (req, res) => {
  const event = new Event(req.body)
  const validation = event.validate()

  if (validation.validated) {
    const result = await event.unassign(req.params.id)
    return res.json(result)
  }
  return res.json(validation)
})

router.put('/api/events/:id', async (req, res) => {
  try {
    const id = req.params.id
    const query = `UPDATE events SET fecha = ?, zona_horaria = ?, hora_inicio = ?, hora_final = ?, titulo = ?, descripcion = ?, tarea_titulo = ?, tarea_descripcion = ? WHERE id = ${id}`

    const { values } = await database.connection.execute(
      query,
      Object.values(req.body)
    )
    return res.status(201).json({
      status: 201,
      update_data: req.body,
    })
  } catch (error) {
    return res.status(200).json({
      status: 200,
      error: true,
      message: error.message,
    })
  }
})

router.delete('/api/events/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { affectedRows } = await database.query(
      `DELETE FROM events WHERE id = ${id}`
    )
    if (affectedRows) {
      res.status(200).json({
        status: 200,
        data_delete: 'ok',
      })
    }
    res.status(400).json({
      status: 400,
      error: true,
      message_error: `El registro ${id} no existe`,
    })
  } catch (error) {
    return res.status(400).json({
      status: 400,
      error: true,
      message: error.message,
    })
  }
})

module.exports = router

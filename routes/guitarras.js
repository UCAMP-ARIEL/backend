/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Guitarra = require('../models/Guitarra') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS

// A. GUITARRAS

app.get('/obtener-guitarras', async (req, res) => {
	try {
		const guitarras = await Guitarra.find({})

		res.json({
			guitarras,
		})
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error obteniendo los datos',
		})
	}
})

app.post('/crear-guitarra', async (req, res) => {
	const { nombre, precio } = req.body

	try {
		const nuevaGuitarra = await Guitarra.create({ nombre, precio })

		res.json(nuevaGuitarra)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error creando la guitarra',
		})
	}
})

app.put('/actualizar-guitarra', async (req, res) => {
	const { id, nombre, precio } = req.body

	try {
		const actualizacionGuitarra = await Guitarra.findByIdAndUpdate(id, { nombre, precio }, { new: true })

		res.json(actualizacionGuitarra)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando la guitarra',
		})
	}
})

app.delete('/borrar-guitarra', async (req, res) => {
	const { id } = req.body

	try {
		const guitarraBorrada = await Guitarra.findByIdAndRemove({ _id: id })

		res.json(guitarraBorrada)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando la guitarra especificada',
		})
	}
})

module.exports = app

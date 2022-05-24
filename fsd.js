// 1. IMPORTACIONES
const express = require('express')
const app = express()
const cors = require('cors')

const connectDB = require('./config/db')

const Usuario = require('./models/Usuario')

// 2. MIDDLEWARES
// VARIABLES DE ENTORNO
require('dotenv').config()

// CONEXIÓN A DB
connectDB()

// Habilitar CORS
app.use(cors())
app.use(express.json())

// 3. RUTEO

app.get('/obtener-usuarios', async (req, res) => {
	try {
		const usuarios = await Usuario.find({})

		res.json({
			usuarios,
		})
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error obteniendo los datos',
		})
	}
})

app.post('/crear-usuario', async (req, res) => {
	const { nombre, pais } = req.body
	const nuevaUsuario = await Usuario.create({ nombre, pais })
	res.json(nuevaUsuario)
})

// 4. SERVIDOR
app.listen(process.env.PORT, () => {
	console.log('El servidor está de pie')
})

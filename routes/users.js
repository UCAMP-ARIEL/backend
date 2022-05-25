/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Usuario = require('../models/Usuario') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

app.get('/obtener-usuarios', async (req, res) => {
	try {
		const usuarios = await Usuario.find({})
		res.json({ usuarios })
	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

// CREAR UN USUARIO JWT
app.post('/crear', async (req, res) => {
	const { nombre, email, password } = req.body // OBTENER USUARIO, EMAIL Y PASSWORD DE LA PETICIÓN

	try {
		// GENERAMOS STRING ALEATORIO PARA USARSE CON EL PASSWORD
		const salt = await bcryptjs.genSalt(10)
		const hashedPassword = await bcryptjs.hash(password, salt)

		// CREAMOS UN USUARIO CON SU PASSWORD ENCRIPTADO
		const respuestaDB = await Usuario.create({
			nombre,
			email,
			password: hashedPassword,
		})
		// USUARIO CREADO. VAMOS A CREAR EL JSON WEB TOKEN

		// 1. EL "PAYLOAD" SERÁ UN OBJETO QUE CONTENDRÁ EL ID DEL USUARIO ENCONTRADO EN BASE DE DATOS.
		// POR NINGÚN MOTIVO AGREGUES INFORMACIÓN CONFIDENCIAL DEL USUARIO (SU PASSWORD) EN EL PAYLOAD.

		const payload = {
			user: {
				id: respuestaDB._id,
			},
		}

		// 2. FIRMAR EL JWT
		jwt.sign(
			payload, // DATOS QUE SE ACOMPAÑARÁN EN EL TOKEN
			process.env.SECRET, // LLAVE PARA DESCIFRAR LA FIRMA ELECTRÓNICA DEL TOKEN,
			{
				expiresIn: 360000, // EXPIRACIÓN DEL TOKEN
			},
			(error, token) => {
				// CALLBACK QUE, EN CASO DE QUE EXISTA UN ERROR, DEVUELVA EL TOKEN
				if (error) throw error
				res.json({ token })
			}
		)
	} catch (error) {
		return res.status(400).json({
			msg: error,
		})
	}
})

module.exports = app

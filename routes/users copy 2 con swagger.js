/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Usuario = require('../models/Usuario') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              nombre:
 *                  type: string
 *                  description: Nombre de la persona
 *              pais:
 *                  type: string
 *                  description: País de la persona
 *          required:
 *              - id
 *              - nombre
 *              - pais
 *          example:
 *              id: 0
 *              nombre: Mike
 *              pais: Argentina
 */

//GET
/**
 * @swagger
 * /api/obtener-usuarios:
 *  get:
 *      summary: Trae todos los usuarios
 *      tags: [User]
 *      responses:
 *          200:
 *              description: Todos los usuarios
 */

app.get('/obtener-usuarios', async (req, res) => {
	const { pais, nombre } = req.query
	try {
		const usuarios = pais ? await Usuario.find({ pais: pais }) : await Usuario.find({})
		console.log('usuarios :', usuarios)
		res.json({ usuarios })
	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
})

//POST
/**
 * @swagger
 * /api/crear-usuario:
 *  post:
 *      summary: Crea un usuario
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Nuevo usuario creado
 */

//...

// B. USUARIOS
// CREAR UN USUARIO
app.post('/usuario/crear', async (req, res) => {
	// OBTENER USUARIO, EMAIL Y PASSWORD DE LA PETICIÓN
	const { username, email, password } = req.body

	try {
		// GENERAMOS FRAGMENTO ALEATORIO PARA USARSE CON EL PASSWORD
		const salt = await bcryptjs.genSalt(10)
		const hashedPassword = await bcryptjs.hash(password, salt)

		// CREAMOS UN USUARIO CON SU PASSWORD ENCRIPTADO
		const respuestaDB = await Usuario.create({
			username,
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

				res.json({
					token,
				})
			}
		)
	} catch (error) {
		return res.status(400).json({
			msg: error,
		})
	}
})

//PUT
/**
 * @swagger
 * /api/actualizar-usuario:
 *  put:
 *      summary: Edita un usuario
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Usuario editado
 */

app.put('/actualizar-usuario', async (req, res) => {
	const { id, nombre, pais } = req.body

	try {
		const actualizacionUsuario = await Usuario.findByIdAndUpdate(id, { nombre, pais }, { new: true })

		res.json(actualizacionUsuario)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando la Usuario',
		})
	}
})

//delete
/**
 * @swagger
 * /api/borrar-usuario:
 *  delete:
 *      summary: Elimina un usuario
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Usuario Eliminado
 */

app.delete('/borrar-usuario', async (req, res) => {
	const { id } = req.body

	try {
		const UsuarioBorrada = await Usuario.findByIdAndRemove({ _id: id })

		res.json(UsuarioBorrada)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error borrando el Usuario especificado',
		})
	}
})

module.exports = app

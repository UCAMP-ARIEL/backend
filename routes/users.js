/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const Usuario = require('../models/Usuario') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS

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

app.post('/crear-usuario', async (req, res) => {
	const { nombre, pais } = req.body
	const nuevaUsuario = await Usuario.create({ nombre, pais })
	res.json(nuevaUsuario)
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

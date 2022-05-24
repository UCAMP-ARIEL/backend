/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express.Router()
const bodyParser = require('body-parser')

let users = [
	{
		id: 0,
		nombre: 'Mike',
		pais: 'Argentina',
	},
]

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
 * /api/users:
 *  get:
 *      summary: Trae todos los usuarios
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
 *              description: Todos los usuarios
 */

app.get('/users', (req, res) => {
	res.json(users)
})

//POST
/**
 * @swagger
 * /api/users:
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

app.post('/users', (req, res) => {
	const { nombre, pais } = req.body
	const id = users.length

	users.push({ id, nombre, pais })

	res.json(users)
})

//PUT
/**
 * @swagger
 * /api/users:
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
app.put('/users', (req, res) => {
	const { id, nombre, pais } = req.body
	const usersFiltered = users.map((e) => {
		return e.id == id ? { id, nombre, pais } : e
	})
	users = usersFiltered
	res.json(users)
})

//delete
/**
 * @swagger
 * /api/users:
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
app.delete('/users', (req, res) => {
	const { id } = req.body
	const usersFiltered = users.filter((e) => e.id != id)
	users = usersFiltered
	res.json(users)
})

module.exports = app

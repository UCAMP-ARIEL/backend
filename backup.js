/* A middleware for CORS that will be executed before the route. */
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*')
// 	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
// 	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
// 	next()
// })

/* Importing the express module and creating an instance of it. */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

/* A middleware that parses the body of the request and makes it available in the request object. */
app.use(bodyParser.json())

const users = [
	{
		id: 0,
		nombre: 'Mike',
		pais: 'México',
	},
]

// LEER TODAS LAS PERSONAS
app.get('/', (req, res) => {
	res.json(users)
})
app.get('/api', (req, res) => {
	const user_id = req.query.id
	console.log('user_id :', user_id)
	res.json(users)
})
app.get('/api/:id', (req, res) => {
	const user_id = req.params.id
	console.log('user_id :', user_id)
	res.json(users)
})

// CREAR UNA PERSONA
app.post('/', (req, res) => {
	const { nombre, pais } = req.body
	const id = users.length
	users.push({ id, nombre, pais })
	res.json(users)
})

// ACTUALIZAR UNA PERSONA
app.put('/users', (req, res) => {
	const { id, nombre, pais } = req.body

	const usersFiltered = users.map((e) => {
		return e.id == id ? { id, nombre, pais } : e
	})
	users = usersFiltered
	res.json(users)
})

// BORRAR UNA PERSONA
app.delete('/users', (req, res) => {
	const { id } = req.body

	const usersFiltered = users.filter((e) => e.id != id)

	users = usersFiltered
	res.json(users)
})

/* A route that will be executed when the user navigates to the /form path. */
app.get('/form', function (req, res) {
	res.send(
		'<html><head> \
			<link href="/assets/style.css" rel="stylesheet"> \
			</head><body>\
				<form method="POST" action="/form">\
				Nombre <input name="nombre" type="text"><br>\
				Apellido <input name="apellido" type="text"><br>\
				Curso <input name="curso" type="text"><br>\
				<input type="submit">\
				</form>\
			</body></html>'
	)
})
// 4. SERVIDOR
app.listen(3000, () => {
	console.log('El servidor está de pie')
})

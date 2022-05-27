// 1. IMPORTACIONES
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRoutes = require('./routes/users')
const guitarRoutes = require('./routes/guitarras')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const path = require('path')
const cors = require('cors') // IMPORTAMOS CORS
const connectDB = require('./config/db') // IMPORTAMOS UNA CARPETA PARA NUESTRA BASE DE DATOS, AÚN NO LA CREAMOS

const swaggerSpec = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API REST UCAMP',
			version: '1.0.0',
		},
		servers: [
			{
				url: 'http://localhost:3000',
			},
		],
	},
	apis: [`${path.join(__dirname, './routes/users.js')}`],
}

// 2. MIDDLEWARES

// VARIABLES DE ENTORNO
require('dotenv').config()

// CONEXIÓN A DB
connectDB()

// Habilitar CORS
app.use(cors())

// BODY-PARSER
app.use(express.json())
app.use(bodyParser.json())

//3. Rutas
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))
app.use('/api', guitarRoutes)
app.use('/usuario', userRoutes)
app.get('/', (req, res) => res.send('UCAMP API'))

// 4. SERVIDOR
app.listen(process.env.PORT, () => {
	console.log('El servidor está corriendo en 3000')
})

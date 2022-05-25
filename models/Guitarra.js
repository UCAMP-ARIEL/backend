// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const guitarraSchema = mongoose.Schema(
	{
		nombre: {
			type: String,
			required: true,
		},
		precio: {
			type: Number,
		},
	},
	{
		timestamps: true, // Permite agregar la fecha en el que fue generado el documento.
	}
)

// 3. MODELO
const Guitarra = mongoose.model('Guitarra', guitarraSchema)

// 4. EXPORTACIÓN
module.exports = Guitarra

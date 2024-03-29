const mongoose = require('mongoose')
//Connecting to MongoDB

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	// eslint-disable-next-line no-unused-vars
	.then(result => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

// Phone Schema
const phonebookSchema = new mongoose.Schema({
	name: String,
	number: String,
})

phonebookSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', phonebookSchema)
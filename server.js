require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

const unknownEndPoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

// Middleware
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

// GET return list of persons
app.get('/api/persons', (req, res, next) => {
	Person.find({}).then(response => {
		res.json(response)
	}).catch(error => next(error))
})

// GET Display information for a single phonebook entry.
app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id).then(result => {
		if (result) {
			res.json(result)
		}
		else {
			res.status(404).end()
		}
	}).catch(error => next(error))
})

// PGenerate ID
const generateId = () => {
	return Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER))
}

// Update person
app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const updatedPerson = new Person({
		name: body.name,
		number: body.number,
	})

	Person.findByIdAndUpdate(req.params.id, updatedPerson,
		{ new: true }).then((result) => {
		res.json((result))
	}).catch((error) => next(error))
})

// DELETE delete persons by id
app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		}).catch(error => next(error))
})


// POST add new person
app.post('/api/persons', (req, res, next) => {
	const body = req.body

	if (!body.name) {
		return res.status(400).json({
			error: 'Name is missing'
		})
	}
	else if (!body.number) {
		return res.status(400).json({
			error: 'Number is missing'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
		id: generateId()
	})

	person.save().then(response => {
		res.json(response)
	}).catch(error => next(error))
})

// GET info of how many entries are in persons objects
app.get('/info', (req, res, next) => {
	Person.countDocuments({}).then(count => {
		let info = `<p>Phonebook has info for ${count} people</p>`
		info += new Date()
		res.send(info)
	}).catch(error => next(error))
})

// Error handler
const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError' && error.message.includes('Objected')) {
		return res.status(400).send({ error: 'malformed ID' })
	}
	next(error)
}
app.use(errorHandler)

// Server info
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

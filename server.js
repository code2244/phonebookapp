require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
// GET return list of persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})
// GET Display information for a single phonebook entry.
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(note => note.id === id);
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// POST add new person
const generateId = () => {
  return Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER))
}

app.post('/api/persons', (req, res) => {
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
  else if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'Person already exist'
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  
  persons = persons.concat(person)
  res.json(person)
})

// DELETE delete persons by id
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

// GET info of how many entries are in persons objects
app.get('/info', (req, res) => {
  let info = `<p>Phonebook has info for ${persons.length} people</p>`
  info += new Date()
  res.send(info)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

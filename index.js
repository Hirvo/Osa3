const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

morgan.token('postdata', function getPostData (req) {
  if (req.method==='POST') {
    return " " + JSON.stringify(req.body)
  }
  else
    return " "
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'));

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person =>  person.id === id )
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/api/info', (req, res) => {
  res.send('Phonebook has info for ' + (persons.length) + ' people <br> <br>'
  + (new Date()))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

function generateId() {
  return Math.floor(Math.random() * (99999 - 1) + 1);
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  } else if(!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  } else if(persons.find(n => n.name === body.name)) {
    return response.status(400).json({ 
      error: 'name is already on the list' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

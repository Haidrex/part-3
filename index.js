const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());

app.use(
	morgan(function (tokens, req, res) {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, 'content-length'),
			'-',
			tokens['response-time'](req, res),
			'ms',
			req.method === 'POST' ? JSON.stringify(req.body) : '',
		].join(' ');
	})
);

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/', (req, res) => {
	res.send('<h1>hello world</h1>');
});

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.get('/info', (req, res) => {
	res.send(`<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date()}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id;
	const person = persons.find((person) => person.id === Number(id));
	if (person) {
		res.json(person);
	} else {
		res.status(400).json({ error: `User by id ${id} not found` });
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter((person) => person.id !== id);

	res.status(204).end();
});

app.post('/api/persons', (req, res) => {
	const person = req.body;

	if (!person.name || !person.number) {
		return res.status(404).json({ error: 'Missing name or number' });
	}

	const isFound = persons.find((item) => item.name === person.name);
	if (isFound) {
		return res
			.status(404)
			.json({ error: 'User already exists in the phonebook' });
	}

	person.id = Math.floor(Math.random() * 99999);
	persons = persons.concat(person);
	res.json(person);
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

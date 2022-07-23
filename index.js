require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PhonebookEntry = require('./models/phonebookEntry');

const app = express();

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
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

app.get('/api/persons', (req, res, next) => {
	PhonebookEntry.find({})
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/info', (req, res) => {
	res.send(`<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date()}</p>`);
});

app.get('/api/persons/:id', (req, res, next) => {
	PhonebookEntry.findById(req.params.id)
		.then((result) => {
			if (result) {
				res.json(result);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => {
			next(error);
		});
});

app.delete('/api/persons/:id', (req, res, next) => {
	PhonebookEntry.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
	const newPerson = {
		name: req.body.name,
		number: req.body.number,
	};
	PhonebookEntry.findByIdAndUpdate(req.params.id, newPerson, { new: true })
		.then((result) => {
			res.json(result);
		})
		.catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
	const person = req.body;

	if (!person.name || !person.number) {
		return res.status(404).json({ error: 'Missing name or number' });
	}

	const newPerson = new PhonebookEntry({
		name: person.name,
		number: person.number,
	});

	newPerson
		.save()
		.then((savedPerson) => {
			res.json(savedPerson);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

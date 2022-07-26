const mongoose = require('mongoose');
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

console.log('connecting to ', url);
mongoose
	.connect(url)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

const phoneBookSchema = new mongoose.Schema({
	name: String,
	number: String,
});

phoneBookSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('PhonebookEntry', phoneBookSchema);

const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	);
	// eslint-disable-next-line no-undef
	process.exit(1);
}

// eslint-disable-next-line no-undef
const password = process.argv[2];

const url = `mongodb+srv://rytis:${password}@cluster0.tn7onpf.mongodb.net/phonebookapp`;

mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const PhonebookEntry = mongoose.model('phonebookEntry', phoneBookSchema);

// eslint-disable-next-line no-undef
if (process.argv.length === 3) {
	PhonebookEntry.find({}).then((result) => {
		result.forEach((entry) => {
			console.log(entry);
		});
	});
	mongoose.connection.close();
}

// eslint-disable-next-line no-undef
if (process.argv.length === 5) {
	const phonebookentry = new PhonebookEntry({
		// eslint-disable-next-line no-undef
		name: process.argv[3],
		// eslint-disable-next-line no-undef
		number: process.argv[4],
	});

	phonebookentry.save().then(() => {
		console.log(
			// eslint-disable-next-line no-undef
			`Added "${process.argv[3]}" with number "${process.argv[4]}" to phone book`
		);
		mongoose.connection.close();
	});
}

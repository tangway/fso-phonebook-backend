const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("==>connected to MongoDB");
  })
  .catch((error) => {
    console.log("==>error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// } else if (process.argv.length === 3) {
//   // for listing out every note on the db
//   console.log(`phonebook:`);
//   Person.find({}).then((result) => {
//     result.forEach((p) => {
//       console.log(`${p.name}: ${p.contact}`);
//     });
//     mongoose.connection.close();
//     console.log(`(end of communique)`);
//     process.exit();
//   });
// } else {
//   const person = new Person({
//     name: process.argv[3],
//     contact: process.argv[4],
//   });

//   person.save().then((result) => {
//     console.log("person saved!");
//     mongoose.connection.close();
//   });
// }

module.exports = mongoose.model("Person", personSchema);

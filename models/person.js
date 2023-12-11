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
  number: {
    type: String,
    minLength: 9,
    required: true,
    validate: {
      validator: function(v) {
        const regex1 = /^\d{2}-\d{6,}$/; // 2 digits before the hyphen, 6 or more after the hyphen
        const regex2 = /^\d{3}-\d{5,}$/; // 3 digits before the hyphen, 5 or more after the hyphen
        return regex1.test(v) || regex2.test(v); // returns true if any 1 is true
      },
      message: props => `${props.value} has to be in format nn-nnnnnn or nnn-nnnnn and has to be at least 8 digits`
    }
  }
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

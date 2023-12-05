const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.static('dist'))

// stand-in for the db
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Test Person",
    number: "53453454",
  },
];

// stringify is needed cos req.body is an object and we need to output string 
// onto the console
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));


// for logging received request and sent response without the use of morgan
// `app.use() have to be placed before the routes which need them
app.use((req, resp, next) => {
  console.log(`----------`);
  console.log("Received request:", req.method, req.url);
  next();
});

app.use((req, resp, next) => {
  console.log("Sending response:", resp.statusCode, resp.statusMessage);
  console.log(`----------`);
  next();
});

app.get("/api/persons", (req, resp) => {
  resp.json(persons);
});

app.get("/api/persons/:id", (req, resp) => {
  // turns out that this is a string so array.find() initially returned nothing
  // Number() was added as a fail-safe function that can convert strings to integers
  // even if its a string it wont throw an error
  console.dir(req.params);
  console.log(`----------`);
  const id = Number(req.params.id);
  const note = persons.find((n) => {
    // console.log(`(checking type and equality for GET /:id)`)
    // console.log(`id: ${typeof id}, n.id: ${typeof n.id}, ${n.id === id}`);
    // console.log(`----------`)
    return n.id === id;
  });
  if (!note) {
    resp.status(404).json({ error: "person not found" });
  } else {
    resp.json(note);
  }
});

// There can only be one response.send() statement in an Express app route. 
// Once you send a response to the client using response.send(), the 
// request-response cycle is complete and no further response can be sent.
app.get("/info", (req, resp) => {
  resp.send(`<p>Phonebook has info for ${persons.length} ppl.</p> 
  <p>Requested at: ${new Date()}</p>`);
});

// personIndex is a check that will result in -1 if the requirement is nt found
app.delete("/api/persons/:id", (req, resp) => {
  const id = Number(req.params.id);
  const personIndex = persons.findIndex((p) => p.id === id);
  const personName = persons.filter((p) => p.id === id)[0].name;

  if (personIndex === -1) {
    resp.status(404).json({ error: "person not found" });
  } else {
    // persons is updated in this way to reflect the filter function where only 
    // the array items that do not match the request id is left
    // filter works by only returning the items that are true to the condition
    persons = persons.filter((n) => n.id !== id);
    resp
      .status(202)
      .json(
        `${personName} has been deleted, there are currently ${persons.length} ppl in the phonebook`
      );
  }
});

// this helps to attach the req data to body, check the difference in console output
// between having this line and not
// this led to a whole investigation where i posted at https://tangway.github.io/posts/expressjson/
app.use(express.json());

app.post("/api/persons", (req, resp) => {
  // req.body has the req
  // do data validation with app requirements
  // generate a random big enough ID for it
  // use spread operator to append it to addedPerson obj
  // concat addedPerson onto persons array and make new copy of the array
  // then send resp of ok when everything is ok, and error when it's not

  let addedPerson = req.body;
  const duplicateNameCheck = persons.findIndex(
    (p) => p.name === addedPerson.name
  );

  // check if name or number property is missing
  // check if name already exists and throw error
  if (!addedPerson.name || !addedPerson.number) {
    resp.status(404).json({ error: "name or number cannot be empty" });
  } else if (duplicateNameCheck > -1) {
    resp.status(404).json({ error: "name already exist in phonebook" });
  } else {
    // process of adding addedPerson to persons array
    const id = Math.floor(Math.random() * 10000000);
    addedPerson = { id: id, ...addedPerson };
    console.log(addedPerson);
    // updating of persons array which i sometimes forget
    persons = persons.concat(addedPerson);
    console.log(persons);
    resp.json(persons);
  }
});

// // the exploration into how request body data is at
// // it is made to be used without express.json()
// app.post("/api/persons", (req, res) => {
//   console.dir(req.body);

//   let rawData = "";
//   // let rawData = []

//   // req.on("error", err => {
//   //   console.error(err.stack)
//   // })

//   req.on("data", chunk => {
//     rawData += chunk;
//     // rawData.push(chunk)
//   });

//   req.on("end", () => {
//     try {
//       req.body = JSON.parse(rawData);
//       // rawData = Buffer.concat(rawData).toString()
//       // console.log(rawData)
//       console.log(req.body);
//       res.send("Received the request");
//     } catch (err) {
//       console.log(err);
//     }
//   });
// });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} at ${new Date()}`);
});

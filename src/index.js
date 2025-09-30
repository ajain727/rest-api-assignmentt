const express = require("express");
const { v4: generateId } = require("uuid");

const service = express();
service.use(express.json());

// in-memory storage
let people = [];

// Create a Person
service.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const person = { id: generateId(), name, email };
  people.push(person);
  res.status(201).json(person);
});

// Retrieve a Person
service.get("/users/:identifier", (req, res) => {
  const person = people.find(p => p.id === req.params.identifier);
  if (!person) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(person);
});

// Update a Person
service.put("/users/:identifier", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const person = people.find(p => p.id === req.params.identifier);
  if (!person) {
    return res.status(404).json({ error: "User not found" });
  }

  person.name = name;
  person.email = email;
  res.json(person);
});

// Delete a Person
service.delete("/users/:identifier", (req, res) => {
  const index = people.findIndex(p => p.id === req.params.identifier);
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  people.splice(index, 1);
  res.status(204).send();
});

// Start server only if not testing
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  service.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = service; // required for Jest

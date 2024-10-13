const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async function (request, response) {
  try {
    const todos = await Todo.findAll();  // Fetch all todos
    response.render("index", { todos });  // Pass todos to the template
  } catch (error) {
    console.error("Error fetching todos:", error);
    response.status(500).send("An error occurred while fetching todos.");
  }
});


app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
  try {
    const todos = await Todo.findAll();  // Using findAll to get all Todos
    response.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    response.status(500).json({ error: "An error occurred while fetching todos." });
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  const { todo } = request.body;  // Assuming 'todo' is the input field name
  if (!todo || todo.trim().length === 0) {
    return response.status(400).json({ error: "Todo text cannot be empty" });
  }
  try {
    const newTodo = await Todo.create({ text: todo });  // Adjust this line to match your Sequelize model structure
    return response.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    return response.status(422).json(error);
  }
});


app.put("/todos/:id/markAsCompleted", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


app.delete("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found" });
    }
    await todo.destroy();
    return response.json(true);
  } catch (error) {
    console.error("Error deleting todo:", error);
    return response.status(500).json({ error: "An error occurred while deleting the todo." });
  }
});


module.exports = app;

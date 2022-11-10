var express = require("express");
var router = express.Router();
var { uuid } = require("uuidv4");
const { db } = require("../mongo");
var { validateTodoData } = require("../dataValidation");

const mockTodos = [
  {
    id: "4387f4d8-aeac-4559-9f1b-3c5d537c955c",
    title: "Implement Fullstack ToDo List",
    description: "Implement the fullstack todo list application.",
    isComplete: false,
    priority: "High",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
  {
    id: "e365f13c-4c1d-4ee1-8a66-3dbbbab71f0d",
    title: "Create /all route for mock data",
    description:
      "Create an express route that will respond with the mock todo list.",
    isComplete: false,
    priority: "High",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
  {
    id: "08dd1f20-7d31-4120-89ed-343d4006a7cb",
    title: "Create a home page in the client",
    description: "Create a Home Page in React that will display all the todos.",
    isComplete: false,
    priority: "High",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
  {
    id: "98a06f8f-50c9-4832-9d2d-daa45543db00",
    title: "Create the todo card component",
    description:
      "Create a react ToDoCard component that will be rendered for each todo on the home page.",
    isComplete: false,
    priority: "Medium",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
  {
    id: "7c5d70bb-2a00-4009-9bb8-1bb163fb501f",
    title: "Test basic application with mock data",
    description:
      "Visit the client Home Page to see the todo's displayed as a list.",
    isComplete: false,
    priority: "Medium",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
];

/* GET users listing. */
router.get("/allfromDB/", async function (req, res, next) {
  try {
  const sortParams = {
    

  }
  sortParams[req.query.sortBy] = req.query.order

  const skip = ((Number(req.query.page)-1)*(Number(req.query.limit)))

  /* 15 todos
    page 3 skip 10 todos limit 5 per page

    page-1*limit
  */

 
    const allTodos = await db().collection("todos").find().sort({...sortParams}).limit(Number(req.query.limit)).skip(skip).toArray();
    res.json({
      success: true,
      todos: allTodos,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.toString(),
    });
  }
});

router.post("/add-todo", async function (req, res, next) {
  
  try {
    const newTodo = {
      id: uuid(),
      title: req.body.title,
	    description: req.body.description,
	    priority: req.body.priority,
      isComplete: false,
      creationDate: new Date(),
      lastModified: new Date(),
      completedDate: null,
    };

    const dataCheck = validateTodoData(newTodo);
	
    if (dataCheck.isValid === false) {
      res.json({
        success: false,
        message: dataCheck.message,
		
      });
	  
      return;
    }
    const addTodo = await db().collection("todos").insertOne(newTodo);

    console.log(addTodo);

    res.json({
      success: true,
      todo: newTodo,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.toString(),
    });
  }

  // const addTodo = await db().collection('todos').insertOne(newTodo)
});

router.put("/complete-todo/:id", async function (req, res, next) {
  try {
    let updateTodo = {};
    console.log(req.body.isComplete);
    if (req.body.isComplete === true) {
      updateTodo = {
        isComplete: false,
        completedDate: null,
        lastModified: new Date(),
      };
    }
    if (req.body.isComplete === false) {
      updateTodo = {
        isComplete: true,
        completedDate: new Date(),
        lastModified: new Date(),
      };
    }

    const completeTodo = await db()
      .collection("todos")
      .update(
        {
          id: req.params.id,
        },
        { $set: { ...updateTodo } }
      );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.toString(),
    });
  }
});

router.delete("/delete-todo/:id", async function (req, res, next) {
  try {
    const deleteTodo = await db().collection("todos").findOneAndDelete({
      id: req.params.id,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.toString(),
    });
  }
});
module.exports = router;

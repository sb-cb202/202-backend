require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()

// middleware
app.use(cors())
app.use(express.json())

/* CRUD: 
CREATE ==> Post request
READ ==> Get request
UPDATE ==> Put request
DELETE ==> Delete request
*/

// READ (GET)
app.get("/todos", async (req, res) => {
    try {
        const response = await fetch(process.env.JSONBIN_URL, {
            method: "GET",
            headers: {
                "X-Master-Key": process.env.JSONBIN_MASTER_KEY,
                "X-Access-Key": process.env.JSONBIN_ACCESS_KEY
            }
        })

        const data = await response.json()

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            message: "Error getting data",
            error: error.message
        })
    }
})

// CREATE (POST)
app.post("/create-todo", async (req, res) => {  
    try {
        // 1. GET existing todos
        const getResponse = await fetch(process.env.JSONBIN_URL, {
            method: "GET",
            headers: {
                "X-Master-Key": process.env.JSONBIN_MASTER_KEY,
                "X-Access-Key": process.env.JSONBIN_ACCESS_KEY,
            }
        })

        const getData = await getResponse.json()

        // 2. Auto increment ID
        const existingTodos = getData.record.todos || []
        const nextId = existingTodos.length > 0 
            ? Math.max(...existingTodos.map(t => t.id)) + 1 
            : 1

        // 3. Append new todo with auto incremented ID
        const newTodo = { id: nextId, ...req.body }
        const updatedTodos = [...existingTodos, newTodo]

        // 4. PUT the full updated array back
        const putResponse = await fetch(process.env.JSONBIN_URL, { 
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": process.env.JSONBIN_MASTER_KEY,
                "X-Access-Key": process.env.JSONBIN_ACCESS_KEY
            },
            body: JSON.stringify({ todos: updatedTodos })
        })

        const data = await putResponse.json()

        res.status(201).json({
            message: "Saved successfully",
            data
        })
    } catch (error) {
        res.status(500).json({
            message: "Error saving data",
            error: error.message
        })
    }
})

// What a typical POST request would look like:
// --------------------------------------------
// app.post("/create-todo", async (req, res) => {
//     try {
//         const response = await fetch(URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-Master-Key": process.env.JSONBIN_MASTER_KEY,
//                 "X-Access-Key": process.env.JSONBIN_ACCESS_KEY
//             },
//             body: JSON.stringify(req.body)
//         })

//         const data = await response.json()

//         res.status(200).json({
//             message: "Saved successfully",
//             data
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: "Error saving data",
//             error: error.message
//         })
//     }
// })

// DELETE a todo by ID
app.delete("/delete-todo/:id", async (req, res) => {
    try {
        // 1. GET existing todos
        const getResponse = await fetch(process.env.JSONBIN_URL, {
            method: "GET",
            headers: {
                "X-Master-Key": process.env.JSONBIN_MASTER_KEY,
                "X-Access-Key": process.env.JSONBIN_ACCESS_KEY,
            }
        })

        const getData = await getResponse.json()

        // 2. Filter out the todo with the matching ID
        const existingTodos = getData.record.todos || []
        const updatedTodos = existingTodos.filter(r => String(r.id) !== req.params.id)

        // 3. PUT the updated array back
        const putResponse = await fetch(process.env.JSONBIN_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": process.env.JSONBIN_MASTER_KEY,
                "X-Access-Key": process.env.JSONBIN_ACCESS_KEY
            },
            body: JSON.stringify({ todos: updatedTodos })
        })

        const data = await putResponse.json()

        res.status(200).json({
            message: "Deleted successfully",
            data
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting todo",
            error: error.message
        })
    }
})

// listen for requests
const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
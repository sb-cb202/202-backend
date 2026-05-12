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

// CREATE
app.post("/students", (req, res) => {
    // creating data to add to "mock database"
    const newStudent = {
        id: students.length + 1,
        name: req.body.name
    }

    // add new student to "mock database"
    students.push(newStudent)

    // return successful status code and newly created data 
    res.status(200).json(newStudent)
})

// READ
app.get("/students", (req, res) => {
    res.status(200).json(students)
})

// UPDATE
app.put("/students/:id", (req, res) => {
    // finding the object within the "mock database" that has a matching ID
    const student = students.find(student => student.id == req.params.id)

    student.name = req.body.name

    res.status(200).json(student)
})


// DELETE
app.delete("/students/:id", (req, res) => {
    students = students.filter(s => s.id != req.params.id)

    res.status(200).json({ message: "Student deleted" })
})

app.listen(3001, () => {
    console.log("Server running on port 3001")
})
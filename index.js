const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { v4 } = require('uuid')
const path = require('path')

const {sign, verify} = require('./function/jwt')

const { rows } = require('./database/pg')
const query = require('./src/model/query')

const uploadsDir = path.join(__dirname, "./static/images")

// load routes
const userRoutes = require('./src/routes/user')


// defines
const PORT = process.env.PORT || 4001

const app = express()

// middleware
app.use(express.urlencoded({ extended: true, }))
app.use(fileUpload())
app.use(helmet())
app.use(express.json())
app.use(express.static('static'))
app.use(cors())

// routes
app.use(userRoutes)


app.get('/', async (req, res) => {
    const { access_token } = req.headers

    try {
        verify(access_token)
        const {user_id, userrole, username} = verify(access_token)
        res.send({user_id, userrole, username})        
    } catch (error) {
        console.log(error.message)
    }
})

app.post("/question", async (req, res) => {
    const {title, subject, content, id} = req.body
    try {
        const {photo} = req.files            
        const imgName = v4() + "." + photo.mimetype.split("/")[1]
        // const addresImage = "/images/" + name
        photo.mv(path.join(uploadsDir, imgName), (error) => {
            if(error) {
                console.log(error)
            }
        })
        await rows(query.QUESTION, subject, title, content, id*1, imgName)
        res.send({message: "Savolingiz jo'natildi!"}).status(200)
    } catch (error) {
        await rows(query.QUESTION, subject, title, content, id*1, '')
        res.send({message: "Savolingiz jo'natildi!"}).status(200)
    }
})

app.get("/questions", async (req, res) => {
    const {id} = req.headers
    const questions = await rows(query.QUESTIONS, id*1)
    res.send({data: questions}).status(200)
})

app.post("/score", async (req, res) => {
    const {id} = req.headers
    await rows(query.CHANGE_SCORE, id*1)
    res.send({message: "Ok"}).status(200)
})

app.get("/questions/info", async (req, res) => {
    const info = await rows(query.COUNT_QUESTIONS)
    res.send({data: info}).status(200)
})

app.get("/questions/subject", async (req, res) => {
    const { subject } = req.headers
    const data = await rows(query.QUESTION_BY_SUBJECT, subject)
    res.send({data}).status(200)
})

app.post("/answer", async (req, res) => {
    const {content, id, question_id} = req.body
    await rows(query.CONFIRM_ANSWER, question_id*1)
    try {
        const {photo} = req.files            
        const imgName = v4() + "." + photo.mimetype.split("/")[1]
        // const addresImage = "/images/" + name
        photo.mv(path.join(uploadsDir, imgName), (error) => {
            if(error) {
                console.log(error)
            }
        })
        await rows(query.ANSWER, content, imgName, id*1, question_id*1)
        res.send({message: "Javobingiz jo'natildi. Rahmat!"}).status(200)
    } catch (error) {
        await rows(query.ANSWER, content, '', id*1, question_id*1)
        res.send({message: "Javobingiz jo'natildi. Rahmat!"}).status(200)
    }
})


app.post("/answer/delete", async (req, res) => {
    const { question_id } = req.headers
    await rows(query.DEL_CONFIRM, question_id*1)
    await rows(query.DEL_ANSWER, question_id*1)
    res.send({message: "Javob O'chirildi"}).status(200)
})


app.get("/teachers", async (req, res) => {
    const teachers = await rows(query.TEACHERS)
    res.send({teachers}).status(200)
})


app.post("/teacher/delete", async (req, res) => {
    const { id } = req.headers
    await rows(query.DELETE_ANSWER_WITH_USER, id*1)
    await rows(query.DEL_USER, id*1)
    res.send({message: "Ustoz o'chirildi!"}).status(200)
})


app.get("/students", async (req, res) => {
    const students = await rows(query.STUDENTS)
    res.send({students}).status(200)
})

app.post("/student/delete", async (req, res) => {
    const { id } = req.headers
    await rows(query.DEL_QUESTION, id*1)
    await rows(query.DEL_USER, id*1)
    res.send({message: "O'quvchi o'chirildi!"}).status(200)
})


app.post("/message", async (req, res) => {
    const {name, email, message} = req.body
    await rows(query.ADD_MESSAGE, name, email, message)
    res.send({message: "Xabaringiz qabul qilindi. Javobni emailingizga jo'natamiz. Raxmat!"}).status(200)
})


app.get("/messages", async (req, res) => {
    const messages = await rows(query.GET_MESSAGES)
    res.send({messages}).status(200)
})

app.post("/message/delete", async (req, res) => {
    const { id } = req.headers
    await rows(query.DEL_MESSAGE, id*1)
    res.send({message: "Xabar o'chirildi!"}).status(200)
})





app.listen(PORT, () => console.log('Server ready at: ', PORT))

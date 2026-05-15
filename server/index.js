require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')

app.use(express.json())
app.use(cors())

connection()

const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const deckRoutes = require("./routes/decks")
const flashcardRoutes = require("./routes/flashcards")

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/decks", deckRoutes)
app.use("/api/flashcards", flashcardRoutes)

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
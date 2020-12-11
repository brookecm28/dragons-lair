require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')
const treasureController = require('./controllers/treasureController')
const auth = require('./middleware/middleware')
const app = express()

const PORT = 4000

app.use(express.json())

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
        app.set('db', db)
        console.log('DB Ready')
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    })

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasureController.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureController.getUserTreasure)

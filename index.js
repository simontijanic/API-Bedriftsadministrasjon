require('dotenv').config()

const express = require("express")
const cors = require("cors")
const path = require("path");
const cookieParser = require('cookie-parser');

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static('public'));

const connectToDatabase = require("./controllers/databaseController")
const indexRoute = require("./routes/indexRoute")
const {injectUserData} = require('./middleware/userDataMiddleware');

app.use(injectUserData);
app.use(indexRoute)

app.listen(process.env.PORT, () => {
    connectToDatabase()
    console.log("Listening on PORT")
})
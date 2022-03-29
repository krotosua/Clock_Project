require('dotenv').config()
const express = require("express")
const sequelize = require('./db')
const path = require('path');
const cors = require('cors')
const router = require("./routes/index")
const PORT = process.env.PORT || 5000
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const app = express()
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(cors())
app.use(express.json())
app.use('/api', router)


app.use(errorHandler)


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

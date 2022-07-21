import 'dotenv/config'
import express, {Application} from 'express'
import cors from 'cors'
import router from "./routes/index"
import errorHandler from "./middleware/ErrorHandlingMiddleware"
import sequelizeConnection from "./db";
import http from "http";

const cron = require('node-cron');
const app: Application = express()
const PORT = process.env.PORT || 5000


app.use(cors({
    origin: "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
}))
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)


const start = async (): Promise<void> => {
    try {

        await sequelizeConnection.authenticate()
        cron.schedule('15,35,55 * * * *', () => {
            http.get(`${process.env.API_URL}`);
        });
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()

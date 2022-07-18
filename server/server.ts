import 'dotenv/config'
import express, {Application} from 'express'
import cors from 'cors'
import router from "./routes/index"
import errorHandler from "./middleware/ErrorHandlingMiddleware"
import sequelizeConnection from "./db";
import fileUpload from "express-fileupload";

const app: Application = express()
const PORT = process.env.PORT || 5000


app.use(cors())
app.use(express.json({limit: "10mb"}))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)


const start = async (): Promise<void> => {
    try {
        await sequelizeConnection.authenticate()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()

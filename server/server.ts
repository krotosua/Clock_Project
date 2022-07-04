import 'dotenv/config'
import express, {Application} from 'express'
import cors from 'cors'
import router from "./routes/index"
import errorHandler from "./middleware/ErrorHandlingMiddleware"

const app: Application = express()
const PORT = process.env.PORT || 5000


app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)


const start = async (): Promise<void> => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()

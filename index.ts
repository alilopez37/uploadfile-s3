import express from 'express'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import signale from 'signale'
import dotenv from 'dotenv'
import {uploadRouter} from './routes/upload'

dotenv.config()
const app = express()

//Middleware
const port = process.env.PORT ?? 3000

//Espacio de middleware's
app.use(morgan('dev'))
app.use(fileUpload())
app.use(express.json())

app.use("/upload",uploadRouter)

app.listen(port, ()=>{
    signale.success(`Server online in ${port}`)
})
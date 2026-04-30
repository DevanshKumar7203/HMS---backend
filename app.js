import express from 'express'
import router from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import doctorRoutes from './routes/doctorRoutes.js'
import patientRoutes from './routes/patientRoutes.js';

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(cors(
    {
    origin: "https://hms-frontend-drab-nine.vercel.app/",
    credentials: true
  }
))


app.use('/api/auth', router)

app.use('/api/doctors', doctorRoutes)
app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
    res.send("hello")
})


export default app




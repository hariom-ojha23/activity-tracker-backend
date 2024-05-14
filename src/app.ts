import express from 'express';
import cors from 'cors'
import cookierParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import { connectDB } from './config/db'
import userRoutes from './routes/users'
import organizationRoutes from './routes/organization'
import { errorHandler, notFound } from './middlewares/errorMiddleware'

dotenv.config()

const app = express();
app.use(express.json())

app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}))

app.use(cookierParser())
connectDB()

app.get('/', (_, res) => {
  res.send('Api is working....');
});

app.use('/api/users', userRoutes)
app.use('/api/organization', organizationRoutes)

// error handlers
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 4000;

app.listen(port, () => {
  return console.log(`Server is running at port ${port}`);
});
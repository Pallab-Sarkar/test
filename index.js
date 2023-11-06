import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
const app = express();
import cors from 'cors';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
import customerLogger  from './utils/logger.js'
import dotenv from 'dotenv'
dotenv.config();

//Importing controller (route)
import AuthController from './controller/AuthController.js'
import UserController from './controller/UserController.js'
import BookController from './controller/BookController.js'

const server = createServer(app);
const PORT = process.env.PORT || 8000;

app.use(cors());

// parse application/vnd.api+json as json
app.use(json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));
app.use(json());

mongoose.set('strictQuery', false)
//Connecting to mongodb server
mongoose.connect(process.env.DB_URL || "mongodb://0.0.0.0:27017/assignment");

mongoose.connection.on("connected", () => {
    console.log(`Mongo DB Connected`)
})

mongoose.connection.on("error", (err) => {
    customerLogger.error(err.stack)
})

app.get('/',(req,res) => {
    res.send("Welcome!")
})
app.use('/api/auth', AuthController)
app.use('/api/users', UserController)
app.use('/api/books', BookController)

//Server listening on specified port
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

export default app

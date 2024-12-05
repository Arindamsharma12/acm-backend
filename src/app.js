import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}));

app.use(express.json({
  limit:"16kb"
}))

app.use(express.urlencoded({
  extended:true,
  limit:"16kb"
}))
app.use(express.static('public'));
app.use(cookieParser());

import userRouter from './routes/user.routes.js'
import quizRouter from './routes/admin.route.js';
import userResponseRouter from './routes/userResponse.route.js'

app.use("/api/v1/user",userRouter)
app.use("/api/v2/admin",quizRouter)
app.use("/api/v3/ur",userResponseRouter)

export {app}
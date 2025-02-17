import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import routes from './routes'
import { createServer } from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from '@/configs/passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Server } from 'socket.io'
import { sendMail } from './mails'

const app = express()
const port = 3000

const corsOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : ['https://admin.socket.io']

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: corsOrigins
  }
})

global.io = io

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_STRING || ''
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(
  cors({
    origin: corsOrigins
  })
)
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/', (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>")
})

app.get('/api/auth/signin', (req: any, res) => {
  const messages = req.session.messages || []
  req.session.messages = []

  res.send(`
    <form action="/api/auth/signin" method="post">
      <section>
        <label for="email">Email</label>
        <input id="email" name="email" type="text"  required autofocus>
      </section>
      <section>
        <label for="current-password">Password</label>
        <input id="current-password" name="password" type="password"  required>
      </section>
      <button type="submit">Sign in</button>
      ${messages.length > 0 ? `<p style="color:red;">${messages.join('<br>')}</p>` : ''}
    </form>
  `)
})

app.get('/test', async (req, res) => {
  const hehe = await sendMail(
    'phamduydat2002@gmail.com',
    'Welcome to Our App!',
    'test', // Tên file template
    {
      name: 'Duy Đạt',
      isNewUser: true,
      tips: ['Complete your profile', 'Explore our features', 'Connect with other users']
    }
  )

  res.status(200).json({ success: true, result: { hehe }, message: 'Successfully send mail.' })
})

app.get('/profile', (req, res) => {
  res.send(`Welcome ${req.user?.fullname}: ${req.isAuthenticated() ? 'true' : 'false'}`)
})

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/')
  })
})

app.listen(port, () => {
  console.log(`Workup app listening on port ${port}`)
})

routes(app)

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING || '')
  .then(() => {
    console.log(`Connected to mongodb`)
    server.listen(process.env.PORT, () => {
      console.log(`Workup running onn PORT: ${process.env.PORT}`)
    })
  })
  .catch((err) => console.log(err))

mongoose.set('toJSON', { virtuals: true })

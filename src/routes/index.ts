import { Express } from 'express'
import authRoutes from '@/routes/auth'
import userRoutes from '@/routes/user'

const routes = (app: Express) => {
  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
}

export default routes

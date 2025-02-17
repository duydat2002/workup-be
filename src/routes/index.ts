import { Express } from 'express'
import authRoutes from '@/routes/auth'
import userRoutes from '@/routes/user'
import projectRoutes from '@/routes/project'

const routes = (app: Express) => {
  app.use('/api/auth', authRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/project', projectRoutes)
}

export default routes

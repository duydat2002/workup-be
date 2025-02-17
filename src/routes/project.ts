import express from 'express'
import projectController from '@/controllers/Project'
import { isAuthenticated } from '@/middlewares/auth'
import { handleErrors } from '@/handlers/errorHandler'
import upload from '@/handlers/firebaseUpload'
import { validateData } from '@/middlewares/validation'
import { labelSchema } from '@/validations/user'

const router = express.Router()

router.get('/get', isAuthenticated, handleErrors(projectController.getProjects))
router.get('/:projectId', isAuthenticated, handleErrors(projectController.getProjectById))
router.post('/create', isAuthenticated, upload.single('background'), handleErrors(projectController.createProject))
router.patch('/:projectId', isAuthenticated, upload.single('background'), handleErrors(projectController.updateProject))
router.post('/:projectId/archive', isAuthenticated, handleErrors(projectController.archiveProject))
router.post('/:projectId/unarchive', isAuthenticated, handleErrors(projectController.unarchiveProject))
router.delete('/:projectId', isAuthenticated, handleErrors(projectController.deleteProject))

//Project Labels
router.get('/:projectId/labels', isAuthenticated, handleErrors(projectController.getProjectLabels))
router.post(
  '/:projectId/labels',
  isAuthenticated,
  validateData(labelSchema),
  handleErrors(projectController.createProjectLabel)
)
router.patch('/:projectId/labels/:labelId', isAuthenticated, handleErrors(projectController.updateProjectLabel))
router.delete('/:projectId/labels/:labelId', isAuthenticated, handleErrors(projectController.deleteProjectLabel))

export default router

import { Request, Response } from 'express'
import Project from '@/models/project'
import { singleUpload } from '@/handlers/firebaseUpload'
import Label from '@/models/label'
import Activity from '@/models/activity'
import { getDiff } from '@/utils/diff'

const projectController = {
  getProjectById: async (req: Request, res: Response) => {
    const { projectId } = req.query

    const project = await Project.findOne({ _id: projectId, 'members.user': req.userId })

    if (!project) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found project.'
      })
    }

    return res.status(200).json({
      success: true,
      result: { project },
      message: 'Successfully get project.'
    })
  },
  getProjects: async (req: Request, res: Response) => {
    const projects = await Project.find({ 'members.user': req.userId })

    return res.status(200).json({
      success: true,
      result: { projects },
      message: 'Successfully get projects.'
    })
  },
  createProject: async (req: Request, res: Response) => {
    let { name, description, labels, startDate, dueDate, backgroundUrl } = req.body
    const background = req.file

    console.log('1')

    if (!name && !backgroundUrl && !background) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Missing information.'
      })
    }

    console.log('2')

    const project = await new Project({
      name,
      description,
      labels: labels ? JSON.parse(labels) : undefined,
      members: [{ user: req.userId, role: 'lead', status: 'accepted' }],
      startDate,
      dueDate,
      createdBy: req.userId
    })

    console.log('3')

    if (!backgroundUrl) {
      backgroundUrl = await singleUpload(background, `projects/${project._id.toString()}/background`)
      backgroundUrl = backgroundUrl?.url
    }

    console.log('4')

    project.background = backgroundUrl

    await project.save()

    console.log('5')

    return res.status(200).json({
      success: true,
      result: { project },
      message: 'Successfully create project.'
    })
  },
  updateProject: async (req: Request, res: Response) => {
    const { projectId } = req.params
    let { name, description, labels, startDate, dueDate, backgroundUrl } = req.body
    const background = req.file

    if (!backgroundUrl && background) {
      backgroundUrl = await singleUpload(background, `projects/${projectId}/background`)
      backgroundUrl = backgroundUrl?.url
    }

    const oldProject = await Project.findOne({
      _id: projectId,
      isArchived: false,
      members: { $elemMatch: { user: req.userId, role: 'lead', status: 'accepted' } }
    })

    if (!oldProject) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found project or you do not have permission to perform this action.'
      })
    }

    const project = await Project.findByIdAndUpdate(
      oldProject._id,
      {
        name,
        description,
        labels: labels ? JSON.parse(labels) : undefined,
        startDate,
        dueDate,
        background: backgroundUrl
      },
      { new: true }
    )

    await Promise.all([
      new Activity({
        user: req.userId,
        project: projectId,
        type: 'update_project',
        diffs: getDiff(oldProject.toJSON(), project?.toJSON())
      }).save()
    ])

    global.io.to(projectId).emit('project:updated', project)

    return res.status(200).json({
      success: true,
      result: { project },
      message: 'Successfully update project.'
    })
  },
  archiveProject: async (req: Request, res: Response) => {
    const { projectId } = req.params

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        members: { $elemMatch: { user: req.userId, role: 'lead', status: 'accepted' } }
      },
      {
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: req.userId
      },
      { new: true }
    )

    if (!project) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found project or you do not have permission to perform this action.'
      })
    }

    await Promise.all([
      new Activity({
        user: req.userId,
        project: projectId,
        type: 'archive_project'
      }).save()
    ])

    global.io.to(projectId).emit('project:updated', project)

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully archive project.'
    })
  },
  unarchiveProject: async (req: Request, res: Response) => {
    const { projectId } = req.params

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        members: { $elemMatch: { user: req.userId, role: 'lead', status: 'accepted' } }
      },
      {
        isArchived: false,
        archivedAt: null,
        archivedBy: null
      },
      { new: true }
    )

    if (!project) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found project or you do not have permission to perform this action.'
      })
    }

    await Promise.all([
      new Activity({
        user: req.userId,
        project: projectId,
        type: 'unarchive_project'
      }).save()
    ])

    global.io.to(projectId).emit('project:updated', project)

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully unarchive project.'
    })
  },
  deleteProject: async (req: Request, res: Response) => {
    const { projectId } = req.params

    const project = await Project.findOneAndDelete({
      _id: projectId,
      members: { $elemMatch: { user: req.userId, role: 'lead', status: 'accepted' } }
    })

    if (!project) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found project or you do not have permission to perform this action.'
      })
    }

    global.io.to(projectId).emit('project:deleted', projectId)

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully delete project.'
    })
  },
  // Project Label
  getProjectLabels: async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.projectId).populate('projectLabels')

    const projectLabels = project?.projectLabels.sort((a: any, b: any) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    )

    return res.status(200).json({
      success: true,
      result: { projectLabels },
      message: 'Successfully get project labels.'
    })
  },
  createProjectLabel: async (req: Request, res: Response) => {
    const { projectId } = req.params
    const { name, color } = req.body

    const checkExist = await Label.findOne({
      ownerId: projectId,
      name,
      color
    })

    if (checkExist) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Label already exist.'
      })
    }

    const newLabel = await new Label({
      name: name,
      color: color,
      ownerType: 'Project',
      ownerId: projectId
    }).save()

    await Project.findByIdAndUpdate(
      projectId,
      {
        $addToSet: { projectLabels: newLabel.id }
      },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      result: { label: newLabel },
      message: 'Successfully create project label.'
    })
  },
  updateProjectLabel: async (req: Request, res: Response) => {
    const { name, color } = req.body
    const { projectId, labelId } = req.params

    const checkExist = await Label.findOne({
      _id: { $ne: labelId },
      ownerId: projectId,
      name,
      color
    })

    if (checkExist) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Label already exist.'
      })
    }

    const updatedLabel = await Label.findByIdAndUpdate(
      labelId,
      {
        name,
        color,
        ownerId: projectId
      },
      { new: true }
    )

    if (!updatedLabel)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found label.'
      })

    return res.status(200).json({
      success: true,
      result: { label: updatedLabel },
      message: 'Successfully update project label.'
    })
  },
  deleteProjectLabel: async (req: Request, res: Response) => {
    const { projectId, labelId } = req.params

    const label = await Label.findOneAndDelete({ _id: labelId, ownerId: projectId })

    if (!label) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found this label.'
      })
    }

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully delete project label.'
    })
  }
}

export default projectController

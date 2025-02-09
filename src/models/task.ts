import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    priority: {
      type: String,
      enum: {
        values: ['none', 'low', 'medium', 'high'],
        message: "Priority must be in ['none','low','medium','high']"
      },
      default: 'none'
    },
    labels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Label',
        autopopulate: {
          select: '_id name color',
          maxDepth: 1
        }
      }
    ],
    status: {
      type: String,
      enum: {
        values: ['todo', 'inprogress', 'completed'],
        message: "Task status must be in ['todo', 'inprogress', 'completed']"
      },
      default: 'todo'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    startDate: {
      type: Date,
      requried: false
    },
    dueDate: {
      type: Date,
      requried: false
    },
    finishDate: {
      type: Date,
      requried: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        maxDepth: 1
      }
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    archivedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
        maxDepth: 1
      }
    },
    archivedAt: {
      type: Date,
      default: null
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Attachment'
      }
    ],
    approvals: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Approval'
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  { timestamps: true }
)

TaskSchema.plugin(autopopulate)

const Task = mongoose.model('Task', TaskSchema)

export default Task

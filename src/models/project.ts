import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const membersSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
        maxDepth: 1
      }
    },
    role: {
      type: String,
      enum: {
        values: ['lead', 'editor', 'member'],
        message: "Member role type must be in ['lead', 'editor', 'member']"
      },
      default: 'member'
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted'],
        message: "Member status type must be in ['pending', 'accepted']"
      },
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
)

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    background: {
      type: String,
      required: true
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
    projectLabels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Label',
        autopopulate: {
          select: '_id name color',
          maxDepth: 1
        }
      }
    ],
    startDate: {
      type: Date,
      requried: [true, 'Start date is required.']
    },
    dueDate: {
      type: Date,
      requried: [true, 'Due date is required.']
    },
    finishDate: {
      type: Date,
      requried: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
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
    members: [membersSchema],
    //rule: {},
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      }
    ]
  },
  { timestamps: true }
)

ProjectSchema.plugin(autopopulate)

const Project = mongoose.model('Project', ProjectSchema)

export default Project

import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    automation: {
      status: {
        type: String,
        enum: {
          values: ['unset', 'todo', 'inprogress', 'completed'],
          message: "Status type must be in ['unset', 'todo', 'inprogress', 'completed']"
        },
        required: false
      },
      assign: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: false
        }
      ]
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
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        autopopulate: {
          maxDepth: 1
        }
      }
    ]
  },
  { timestamps: true }
)

CategorySchema.plugin(autopopulate)

const Category = mongoose.model('Category', CategorySchema)

export default Category

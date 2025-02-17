import { ACTIVITY_TYPE } from '@/constants'
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const ActivitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
        maxDepth: 1
      }
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      autopopulate: {
        select: '_id name background members',
        maxDepth: 2
      },
      required: true
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      autopopulate: {
        select: '_id name',
        maxDepth: 1
      }
    },
    diffs: [
      {
        key: String,
        oldValue: String || Number || Object,
        newValue: String || Number || Object
      }
    ],
    datas: {
      type: Map,
      of: Object
    },
    type: {
      type: String,
      enum: ACTIVITY_TYPE,
      required: true
    }
  },
  { timestamps: true }
)

ActivitySchema.plugin(autopopulate)

const Activity = mongoose.model('Activity', ActivitySchema)

export default Activity

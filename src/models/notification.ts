import { NOTIFICATION_ACTION } from '@/constants'
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const NotificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
        maxDepth: 1
      },
      required: false
    },
    receivers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      autopopulate: {
        maxDepth: 1
      }
    },
    type: {
      type: String,
      enum: {
        values: ['normal', 'invitation'],
        message: "Notification type must be in ['normal', 'invitation']"
      },
      default: 'normal'
    },
    datas: {
      type: Map,
      of: Object
    },
    action: {
      type: String,
      enum: NOTIFICATION_ACTION,
      required: true
    }
  },
  { timestamps: true }
)

NotificationSchema.plugin(autopopulate)

const Notification = mongoose.model('Notification', NotificationSchema)

export default Notification

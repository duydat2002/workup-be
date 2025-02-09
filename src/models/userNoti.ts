import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const UserNotiSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notification: {
      type: Schema.Types.ObjectId,
      ref: 'Notification'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isResponded: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

UserNotiSchema.plugin(autopopulate)

const UserNoti = mongoose.model('UserNoti', UserNotiSchema)

export default UserNoti

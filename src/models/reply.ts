import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const ReplySchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
        maxDepth: 1
      },
      required: true
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    isUpdated: {
      type: Boolean,
      default: false
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

ReplySchema.plugin(autopopulate)

const Reply = mongoose.model('Reply', ReplySchema)

export default Reply

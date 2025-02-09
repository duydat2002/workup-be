import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const CommentSchema = new Schema(
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
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task'
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
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reply'
      }
    ]
  },
  { timestamps: true }
)

CommentSchema.plugin(autopopulate)

const Comment = mongoose.model('Comment', CommentSchema)

export default Comment

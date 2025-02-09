import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const ApprovalSchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
        maxDepth: 1
      },
      required: true
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
        maxDepth: 1
      },
      required: true
    },
    description: {
      type: String,
      required: false
    },
    approvedAt: {
      type: Date,
      required: false
    },
    feedback: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: "Approval status must be in ['pending', 'approved', 'rejected']"
      },
      default: 'pending'
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Attachment',
        autopopulate: {
          maxDepth: 1
        }
      }
    ]
  },
  { timestamps: true }
)

ApprovalSchema.plugin(autopopulate)

const Approval = mongoose.model('Approval', ApprovalSchema)

export default Approval

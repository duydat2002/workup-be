import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const AttackmentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: '_id fullname email avatar',
        maxDepth: 1
      }
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    approval: {
      type: String,
      ref: 'Approval'
    },
    name: {
      type: String,
      required: true
    },
    minetype: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

AttackmentSchema.plugin(autopopulate)

const Attackment = mongoose.model('Attackment', AttackmentSchema)

export default Attackment

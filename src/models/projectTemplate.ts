import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const ProjectTempalteSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    categories: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    tasks: {
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }
  },
  { timestamps: true }
)

ProjectTempalteSchema.plugin(autopopulate)

const ProjectTempalte = mongoose.model('ProjectTempalte', ProjectTempalteSchema)

export default ProjectTempalte

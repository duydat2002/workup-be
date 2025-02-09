import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

const LabelSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    ownerType: {
      type: String,
      enum: {
        values: ['User', 'Project'],
        message: "Owner Type must be in ['User', 'Project']"
      },
      required: true
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'ownerType'
    }
  },
  { timestamps: true }
)

LabelSchema.plugin(autopopulate)

const Label = mongoose.model('Label', LabelSchema)

export default Label

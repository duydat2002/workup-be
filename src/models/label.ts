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

LabelSchema.pre(['deleteOne', 'findOneAndDelete'], async function (next) {
  const User = mongoose.model('User')
  const Project = mongoose.model('Project')

  const deletedLabel = await Label.findOne(this.getFilter()).lean()

  if (!deletedLabel) next()
  else {
    if (deletedLabel.ownerType == 'User') {
      await Promise.all([
        User.updateOne({ _id: deletedLabel.ownerId }, { $pull: { userLabels: deletedLabel._id } }),
        Project.updateMany(
          { labels: { $elemMatch: { $eq: deletedLabel._id } } },
          { $pull: { labels: deletedLabel._id } }
        )
      ])
    } else if (deletedLabel.ownerType == 'Project') {
      await Project.updateMany({ _id: deletedLabel.ownerId }, { $pull: { projectLabels: deletedLabel._id } })
    }

    next()
  }
})

const Label = mongoose.model('Label', LabelSchema)

export default Label

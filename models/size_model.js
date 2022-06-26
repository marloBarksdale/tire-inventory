import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema(
  {
    diameter: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      unique: true,
    },
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

sizeSchema.virtual('url').get(function () {
  return `/tire-size/${this._id}`;
});

sizeSchema.virtual('tires', {
  ref: 'Tire',
  localField: '_id',
  foreignField: 'size',
});
sizeSchema.index({ creator: 1 }, { name: 'query_for_creator' });

const Size = mongoose.model('Size', sizeSchema);

export default Size;

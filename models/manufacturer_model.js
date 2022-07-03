import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';

const manufacturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

manufacturerSchema.virtual('url').get(function () {
  return `/manufacturers/${this._id}`;
});

manufacturerSchema.virtual('tires', {
  ref: 'Tire',
  localField: '_id',
  foreignField: 'manufacturer',
});

manufacturerSchema.index({ creator: 1 });

const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);

export default Manufacturer;

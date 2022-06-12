import mongoose from 'mongoose';

const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

manufacturerSchema.virtual('url').get(function () {
  return `/manufacturer/${this._id}`;
});

manufacturerSchema.virtual('tires', {
  ref: 'Tire',
  localField: '_id',
  foreignField: 'manufacturer',
});

const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);

export default Manufacturer;

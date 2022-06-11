import mongoose from 'mongoose';

const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

manufacturerSchema.virtual('url').get(function () {
  return `/manufacturer/${this._id}`;
});

const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);

export default Manufacturer;

import mongoose from 'mongoose';

const tireSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: mongoose.SchemaTypes.ObjectId, ref: 'Size', required: true },
  manufacturer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Manufacturer',
    required: true,
  },
  season: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Season',
    required: true,
  },
  //Add Stock
});

tireSchema.virtual('url').get(function () {
  return `/tire/${this._id}`;
});

const Tire = mongoose.model('Tire', tireSchema);

export default Tire;
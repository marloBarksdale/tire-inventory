import mongoose from 'mongoose';

const tireSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: mongoose.Types.Decimal128, required: true },
  size: { type: mongoose.SchemaTypes.Number, required: true },
  season: { type: mongoose.Types.ObjectId, ref: 'Season' },
});

tireSchema.virtual('url').get(function () {
  return `/tire/${this._id}`;
});

const Tire = mongoose.model('Tire', tireSchema);

export default Tire;

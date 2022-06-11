import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  diameter: { type: mongoose.SchemaTypes.Number, required: true },
});

sizeSchema.virtual('url').get(function () {
  return `/tire-size/${this._id}`;
});

const Size = mongoose.model('Size', sizeSchema);

export default Size;

import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

seasonSchema.virtual('url').get(function () {
  return `/seasons/${this._id}`;
});

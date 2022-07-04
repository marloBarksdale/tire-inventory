import mongoose from 'mongoose';
import Manufacturer from './manufacturer_model.js';
import Season from './season_model.js';
import Size from './size_model.js';

const tireSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Size',
      required: true,
      validate: async (value) => {
        if (!(await Size.findById(value))) {
          console.log('error');
          throw new Error('Enter a valid size');
        }
      },
    },
    manufacturer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Manufacturer',
      required: true,
      validate: async (value) => {
        if (!(await Manufacturer.findById(value))) {
          throw new Error('Enter a valid manufacturer');
        }
      },
    },
    season: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Season',
      required: true,
      validate: async (value) => {
        if (!(await Season.findById(value))) {
          throw new Error('Enter a valid season');
        }
      },
    },
    quantity: { type: Number, required: true, default: 0 },
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    //Add Stock
  },
  { timestamps: true },
);

tireSchema.virtual('url').get(function () {
  return `/tires/${this._id}`;
});

tireSchema.virtual('status').get(function () {
  if (this.quantity < 20) {
    return 'danger';
  }

  if (this.quantity < 50) {
    return 'warning';
  }

  return 'success';
});
tireSchema.index(
  { name: 1, size: 1, manufacturer: 1, season: 1 },
  { unique: true },
);

tireSchema.index({ creator: 1 });
const Tire = mongoose.model('Tire', tireSchema);

export default Tire;

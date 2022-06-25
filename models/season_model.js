import mongoose from 'mongoose';
import _ from 'lodash';

const seasonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

seasonSchema.virtual('url').get(function () {
  return `/seasons/${this._id}`;
});

seasonSchema.virtual('tires', {
  localField: '_id',
  foreignField: 'season',
  ref: 'Tire',
});

// seasonSchema.pre('save', async function (next) {
//   let name = _.split(this.name, /[^a-zA-Z\d\s:]/).join(' ');

//   name = _.startCase(name.toLowerCase());
//   this.name = name;

//   next();
// });

const Season = mongoose.model('Season', seasonSchema);

export default Season;

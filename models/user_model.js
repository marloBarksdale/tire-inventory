import _ from 'lodash';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

userSchema.virtual('name').get(function () {
  return this.first_name + ' ' + this.last_name;
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  return userObject;
};

userSchema.pre('save', async function (next) {
  this.first_name = _.startCase(this.first_name);
  this.last_name = _.startCase(this.last_name);

  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }

  next();
});
const User = mongoose.model('User', userSchema);

export default User;

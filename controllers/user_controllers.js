import User from '../models/user_model.js';
import bcrypt from 'bcrypt';

export const postSignup = async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
      return res.send('There was an error trying to sign up with that email');
    }

    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (error) {}
};

export const getLogin = (req, res, next) => {
  res.send('Login page');
};

export const postLogin = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.send('Not found');
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.send('Cannot login');
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  req.user = user;
  res.send(user);
};

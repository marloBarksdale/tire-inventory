import User from '../models/user_model.js';
import bcrypt from 'bcrypt';
import { store } from '../utils/init.js';

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

export const getSignup = async (req, res, next) => {
  res.render('signup');
};

export const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: [],
  });
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
  res.locals.isLoggedIn = 2;
  res.send(user);
};

export const postLogout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
export const postLogoutAll = async (req, res, next) => {
  const id = req.session.user._id.toString();
  store.all((err, sessions) => {
    sessions.forEach((sesh) => {
      if (sesh.session.user._id.toString() === id) {
        store.destroy(sesh._id);
      }
    });
  });

  res.redirect('login');
};

import User from '../models/user_model.js';
import bcrypt from 'bcrypt';
import { store } from '../utils/init.js';
import _ from 'lodash';

export const postSignup = async (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  if (req.errors) {
    console.log(req.errors._original);

    const details = req.errors.details.map((detail) => {
      return { message: _.startCase(detail.message), path: detail.path[0] };
    });

    console.log(details);

    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      original: req.errors._original,
      errorMessage: req.errors,
      oldInput: { ...req.body },
      validationErrors: req.errors,
    });
  }

  try {
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
      return res.send('There was an error trying to sign up with that email');
    }

    const user = new User(req.body);
    await user.save();
    res.redirect('/');
  } catch (error) {}
};

export const getSignup = async (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: [],
  });
};

export const getLogin = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: [],
  });
};

export const postLogin = async (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.send('Not found');
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.send('Cannot login');
  }

  req.session.user = user;

  res.redirect('/');
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

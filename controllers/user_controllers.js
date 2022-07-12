import User from '../models/user_model.js';
import bcrypt from 'bcrypt';
import { store } from '../utils/init.js';
import _ from 'lodash';
import Joi from 'joi';

export const postSignup = async (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  if (req.errors) {
    const details = req.errors.details.map((detail) => {
      return {
        message: _.upperFirst(_.toLower(_.startCase(detail.message))),
        path: detail.path[0],
      };
    });

    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      original: req.errors._original,
      errorMessage: details[0].message,

      validationErrors: details,
    });
  }

  try {
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

  if (!req.errors) {
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      req.errors = new Joi.ValidationError('Not authorized', [
        {
          message: 'Invalid Credentials',
          path: ['name'],
          type: 'string.name',
          context: { key: 'name', label: 'name' },
        },
      ]);

      req.errors._original = req.body;
    }
  }

  if (req.errors) {
    const details = req.errors.details.map((detail) => {
      return {
        message: _.upperFirst(_.toLower(_.startCase(detail.message))),
        path: detail.path[0],
      };
    });

    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      original: req.errors._original,
      errorMessage: details[0].message,
    });
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

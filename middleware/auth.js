import User from '../models/user_model.js';

const auth = async (req, res, next) => {
  res.locals.isAuthenticated = req.session.user;

  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findOne({ _id: req.session.user._id });

    if (!user) {
      return res.redirect('/login');
    }
    req.session.maxAge = new Date(Date.now() + 3600000);
    res.locals.name = req.session.user.username;
    res.locals.url = req.baseUrl;
    next();
  } catch (error) {}
};

export default auth;

import User from '../models/user_model.js';

const auth = async (req, res, next) => {
  if (!req.session.user) {
    return res.send('Please login');
  }

  try {
    const user = await User.findOne({ _id: req.session.user._id });

    if (!user) {
      return res.send('Please login');
    }

    next();
  } catch (error) {}
};

export default auth;

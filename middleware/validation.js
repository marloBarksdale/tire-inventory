import _ from 'lodash';
import validator from 'validator';
import mongoose from 'mongoose';

const isValid = (schema) => {
  return (req, res, next) => {
    if (req.params.id) {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.send('Not found');
      }
    }

    if (req.body.name) {
      let name = _.split(req.body.name, /[^a-zA-Z\d\s:]/).join(' ');

      req.body.name = _.startCase(name.toLowerCase()).trim();
    }

    if (req.body.email) {
      if (validator.isEmail(req.body.email)) {
        req.body.email = validator.normalizeEmail(req.body.email, {
          all_lowercase: true,
        });
      }
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const err = new Error();
      err.message = error;
      console.log(err);
      next(error);
    }

    next();
  };
};

export { isValid };

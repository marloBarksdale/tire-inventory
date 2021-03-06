import _ from 'lodash';
import mongoose from 'mongoose';
import validator from 'validator';

const isValid = (schema) => {
  return async (req, res, next) => {
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

    try {
      const { error, value } = await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      req.errors = error;
      req.errors._original = { ...req.body };
    }

    if (req.file) {
      req.body.image = req.file.location;
      req.body.imageKey = req.file.key;
    }

    next();
  };
};

export { isValid };

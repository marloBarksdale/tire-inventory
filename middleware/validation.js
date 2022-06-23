import _ from 'lodash';
import validator from 'validator';

const isValid = (schema) => {
  return (req, res, next) => {
    if (req.body.name) {
      let name = _.split(req.body.name, /[^a-zA-Z\d\s:]/).join(' ');

      req.body.name = _.startCase(name.toLowerCase()).trim();
    }

    if (validator.isEmail(req.body.email)) {
      req.body.email = validator.normalizeEmail(req.body.email, {
        all_lowercase: true,
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const err = new Error();
      err.message = error;
      next(error);
    }

    next();
  };
};

export { isValid };

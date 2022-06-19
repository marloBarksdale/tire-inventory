import _ from 'lodash';

const isValid = (schema) => {
  return (req, res, next) => {
    let presence = 'optional';
    if (req.path.includes('update')) {
      presence = 'optional';
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });

    console.log('R');

    if (error) {
      const err = new Error();
      err.message = error;
      next(error);
    }

    next();
  };
};

export { isValid };

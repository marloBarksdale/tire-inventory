const isValid = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.send(error);
    }
  };
};

export { isValid };

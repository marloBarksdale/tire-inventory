import joi from 'joi';

const joiSchemas = {
  tire: joi.object().keys({
    name: joi
      .string()
      .min(3)
      .message('Must be at least three characters')
      .required(),

    price: joi.number().required().exist(),

    size: joi.string().hex().length(24).required(),
    manufacturer: joi
      .string()
      .hex()
      .length(24)
      .required()
      .messages({ 'string.length': 'Please enter a valid manufacturer' }),
    season: joi
      .string()
      .hex()
      .length(24)
      .required()
      .messages({ 'string.length': 'Please enter a valid season' }),
  }),

  manufacturer: joi.object().keys({
    name: joi
      .string()
      .min(3)
      .message('Must be at least three characters')
      .required(),
  }),

  size: joi.object({
    diameter: joi
      .number()
      .min(16)
      .message('hello')
      .max(45)
      .message('Diameter must be between 16 and 45 inches'),
  }),

  season: joi.object().keys({
    name: joi
      .string()
      .min(3)
      .message('Must be at least three characters')
      .required(),
  }),
};

export default joiSchemas;

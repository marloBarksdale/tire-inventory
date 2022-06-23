import joi from 'joi';
import validator from 'validator';

const joiSchemas = {
  user: joi.object().keys({
    first_name: joi.string().trim().required(),
    last_name: joi.string().trim().required(),
    username: joi
      .string()
      .trim()
      .custom((value, helper) => {
        if (validator.contains(value, ' ')) {
          return helper.message('Username does not meet requirements');
        } else {
          return true;
        }
      })
      .required(),
    email: joi.string().email().required(),
    password: joi.string().custom((value, helper) => {
      if (
        !validator.isStrongPassword(value, {
          minLength: 8,
          minUppercase: 1,
          minNumbers: 2,
          minSymbols: 1,
          minLowercase: 1,
        })
      ) {
        return helper.message('Password does not meet requirements');
      } else {
        return true;
      }
    }),
  }),
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

import Joi from 'joi';
import joi from 'joi';
import validator from 'validator';
import User from '../models/user_model.js';

const joiSchemas = {
  user: joi.object().keys({
    first_name: joi.string().trim().required(),
    last_name: joi.string().trim().required(),
    email: joi
      .string()
      .email()
      .message('Please enter a valid email')
      .required()
      .external(async (value) => {
        const exists = await User.findOne({ email: value });
        console.log(exists);
        if (exists) {
          throw new Joi.ValidationError(
            'There was a problem signing up with that email',
            [
              {
                message: 'There was a problem signing up with this email',
                path: ['email'],
                type: 'string.email',
                context: { key: 'email', label: 'email', value },
              },
            ],
          );
        }
      }),
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

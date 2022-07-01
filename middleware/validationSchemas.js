import Joi from 'joi';
import joi from 'joi';
import validator from 'validator';
import Manufacturer from '../models/manufacturer_model.js';
import Season from '../models/season_model.js';
import Size from '../models/size_model.js';
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
      .required()
      .external(async (value) => {
        const exists = await Manufacturer.findOne({ name: value });

        if (exists) {
          throw new Joi.ValidationError('That name is already in use', [
            {
              message: 'That name is already in use',
              path: ['name'],
              type: 'string.name',
              context: { key: 'name', label: 'name', value },
            },
          ]);
        }
      }),
  }),

  size: joi.object({
    diameter: joi
      .number()
      .min(16)
      .max(45)
      .messages({
        'number.min': 'Must be between 16 and 45',
        'number.max': 'Must be between 16 and 45',
      })
      .external(async (value) => {
        const exists = await Size.findOne({ diameter: value });

        if (exists) {
          throw new Joi.ValidationError('That size already exists.', [
            {
              message: 'That size already exists.',
              path: ['diameter'],
              type: 'string.name',
              context: { key: 'diameter', label: 'diameter', value },
            },
          ]);
        }
      }),
  }),

  season: joi.object().keys({
    name: joi
      .string()
      .min(3)
      .message('Must be at least three characters')
      .required()
      .external(async (value) => {
        const exists = await Season.findOne({ name: value });

        if (exists) {
          throw new Joi.ValidationError('That name is already in use', [
            {
              message: 'That name is already in use',
              path: ['name'],
              type: 'string.name',
              context: { key: 'name', label: 'name', value },
            },
          ]);
        }
      }),
  }),
};

export default joiSchemas;

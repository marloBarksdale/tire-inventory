import Joi from 'joi';
import _ from 'lodash';
import Manufacturer from '../models/manufacturer_model.js';
import Season from '../models/season_model.js';
import Size from '../models/size_model.js';
import Tire from '../models/tire_model.js';

export const getTires = async (req, res, next) => {
  try {
    const tires = await Tire.find();

    res.render('tire/tire_list', {
      pageTitle: 'All Tires',
      path: '/tires',
      prods: tires,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getTire = async (req, res, next) => {
  try {
    const tire = await Tire.findById(req.params.id).populate([
      'manufacturer',
      'season',
      'size',
    ]);

    res.send(tire);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAddTire = async (req, res, next) => {
  const sizes = await Size.find();
  const manufacturers = await Manufacturer.find();
  const seasons = await Season.find();
  const tires = await Tire.find();

  res.render('tire/tire_form', {
    pageTitle: 'Create Tire',
    path: '',
    sizes,
    seasons,
    manufacturers,
  });
};

export const addTire = async (req, res, next) => {
  const { name, manufacturer, season, size, price } = req.body;

  try {
    const exists = await Tire.findOne({ name, manufacturer, season, size });
    const sizes = await Size.find();
    const manufacturers = await Manufacturer.find();
    const seasons = await Season.find();

    if (exists) {
      req.errors = new Joi.ValidationError('This tire already exists', [
        {
          message: 'This tire already exists',
          path: '',
        },
      ]);
    }

    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });
      const tire = { name, manufacturer, season, size, price };
      return res.render('tire/tire_form', {
        path: '',
        pageTitle: 'Create Tire',
        errorMessage: details[0].message,
        tire,
        label: 'Create Tire',
        seasons,
        manufacturers,
        sizes,
      });
    }

    const tire = new Tire({ creator: req.session.user._id, ...req.body });

    await tire.save();
    res.send(tire);
  } catch (error) {
    res.status(406).send(error.message);
  }
};

export const getUpdateTire = async (req, res, next) => {
  try {
    const sizes = await Size.find();
    const manufacturers = await Manufacturer.find();
    const seasons = await Season.find();
    const tire = await Tire.findById(req.params.id);

    res.render('tire/tire_form', {
      path: '',
      pageTitle: 'Update Tire',
      tire,
      original: tire,
      label: 'Update Tire',
      seasons,
      manufacturers,
      sizes,
    });
  } catch (error) {}
};

export const updateTire = async (req, res, next) => {
  try {
    const { name, manufacturer, season, size } = req.body;
    const exists = await Tire.findOne({ name, manufacturer, season, size });
    const sizes = await Size.find();
    const manufacturers = await Manufacturer.find();
    const seasons = await Season.find();
    const tire = await Tire.findById(req.params.id);

    if (exists) {
      req.errors = new Joi.ValidationError('This tire already exists', [
        { message: 'This tire already exists', path: [''] },
      ]);

      req.errors._original = req.body;
    }

    if (!tire) {
      return res.status(404).send('Not found');
    } else if (tire.creator.toString() !== req.session.user._id.toString()) {
      req.errors = new Joi.ValidationError('Not authorized', [
        {
          message: 'You cannot update this Tire',
          path: [''],
        },
      ]);

      req.errors._original = req.body;
    }

    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });

      return res.status(422).render('tire/tire_form', {
        path: '',
        pageTitle: 'Update Tire',
        errorMessage: details[0].message,
        original: req.errors._original,
        validationErrors: details,
        label: 'Update Tire',
        seasons,
        manufacturers,
        sizes,
      });
    }

    // if (!tire) {
    //   return res.status(404).send('Not found');
    // } else if (tire.creator.toString() !== req.session.user._id.toString()) {
    //   return res.status(403).send('Update not allowed');
    // }

    const newTire = await Tire.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true, runValidators: true },
    );
    res.send(newTire);
  } catch (error) {
    res.status(406).send(error.message);
  }
};

export const deleteTire = async (req, res, next) => {
  try {
    const tire = await Tire.findById(req.params.id);

    if (!tire) {
      return res.send('Not found');
    } else if (tire.creator.toString() !== req.session.user._id.toString()) {
      return res.send('Deletion not allowed');
    }

    await Tire.findByIdAndDelete(req.params.id);

    res.send(tire);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

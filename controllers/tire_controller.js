import Joi from 'joi';
import _ from 'lodash';
import Manufacturer from '../models/manufacturer_model.js';
import Season from '../models/season_model.js';
import Size from '../models/size_model.js';
import Tire from '../models/tire_model.js';
import { s3, upload } from '../utils/init.js';

export const index = async (req, res, next) => {
  const tires = await Tire.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate(['size', 'manufacturer', 'season']);
  res.render('index', {
    pageTitle: 'All Tires',
    path: '/tires',
    prods: tires,
  });
};
export const getTires = async (req, res, next) => {
  try {
    const match = {};
    const owner = {};
    if (req.params.id) {
      match.creator = req.params.id;
      owner.creator = true;
    }

    const page = parseInt(req.query.page) || 1;
    const tires = await Tire.find(match)
      .populate(['manufacturer', 'season', 'size'])
      .skip((page - 1) * 6)
      .limit(6);

    const count = await Tire.find(match).countDocuments();

    res.render('tire/tire_list', {
      pageTitle: 'All Tires',
      path: '/tires',
      prods: tires,
      owner,
      currentPage: page,
      hasNext: 6 * page < count,
      hasPrevious: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(count / 6),
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getTire = async (req, res, next) => {
  const owner = {};
  if (req.params.id) {
    owner.creator = true;
  }
  try {
    const tire = await Tire.findById(req.params.id).populate([
      'manufacturer',
      'season',
      'size',
      'creator',
    ]);

    if (tire.creator._id.toString() === req.session.user._id.toString()) {
      res.locals.owner = true;
    }

    res.render('tire/tireDetail', { tire });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAddTire = async (req, res, next) => {
  const sizes = await Size.find().sort({ diameter: 1 });
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
    const sizes = await Size.find().sort({ diameter: 1 });
    const manufacturers = await Manufacturer.find();
    const seasons = await Season.find();

    if (exists) {
      req.errors = new Joi.ValidationError('This tire already exists', [
        {
          message: 'This tire already exists',
          path: '',
        },
      ]);
      req.errors._original = req.body;
    }

    console.log(req.body);
    console.log(req.errors);

    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });

      delete req.errors._original.image;
      const tire = { name, manufacturer, season, size, price };
      return res.render('tire/tire_form', {
        path: '',
        pageTitle: 'Create Tire',
        errorMessage: details[0].message,
        tire,
        original: req.errors._original,
        validationErrors: details,
        label: 'Create Tire',
        seasons,
        manufacturers,
        sizes,
      });
    }

    const tire = new Tire({ creator: req.session.user._id, ...req.body });

    await tire.save();
    res.redirect(tire.url);
  } catch (error) {
    res.status(406).send(error.message);
  }
};

export const getUpdateTire = async (req, res, next) => {
  try {
    const sizes = await Size.find().sort({ diameter: 1 });
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
    const sizes = await Size.find().sort({ diameter: 1 });
    const manufacturers = await Manufacturer.find();
    const seasons = await Season.find();
    const tire = await Tire.findById(req.params.id);

    if (exists && exists._id.toString() !== req.params.id.toString()) {
      req.errors = new Joi.ValidationError('This tire already exists', [
        { message: 'This tire already exists', path: [''] },
      ]);

      req.errors._original = req.body;
      req.errors._original.image = tire.image;
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
      req.errors._original.image = tire.image;
    }

    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });
      req.errors._original.image = tire.image;
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
    res.redirect(newTire.url);
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

    res.redirect('/tires/mine');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

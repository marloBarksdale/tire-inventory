import Joi from 'joi';
import _ from 'lodash';
import Manufacturer from '../models/manufacturer_model.js';
import Tire from '../models/tire_model.js';
import { store } from '../utils/init.js';

export const getManufacturers = async (req, res, next) => {
  try {
    const match = {};
    const owner = {};
    if (req.params.id) {
      match.creator = req.params.id;
      owner.creator = true;
    }

    const manufacturers = await Manufacturer.find(match).populate('tires');

    res.render('list', {
      pageTitle: 'All Manufacturers',
      items: manufacturers,
    });
  } catch (error) {}
};

export const getManufacturer = async (req, res, next) => {
  try {
    if (req.session.error) {
      res.locals.errorMessage = req.session.error;
    }
    const match = {};
    const owner = {};
    if (req.params.id) {
      match.creator = req.params.id;
    }
    const page = parseInt(req.query.page) || 1;
    const manufacturer = await Manufacturer.findById(req.params.id).populate(
      'tires',
    );

    if (
      manufacturer.creator._id.toString() === req.session.user._id.toString()
    ) {
      owner.main = true;
    }

    const tires = await Tire.find({ manufacturer: req.params.id })
      .populate(['size', 'manufacturer', 'season', 'image'])
      .skip((page - 1) * 6)
      .limit(6);

    const count = manufacturer.tires.length;

    res.render('tire/tire_list', {
      pageTitle: 'All Tires',
      path: '/tires',
      subHeading: `/${manufacturer.name}`,
      prods: tires,
      owner,
      item: manufacturer,
      currentPage: page,
      hasNext: 6 * page < count,
      hasPrevious: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(count / 6),
    });

    next();
  } catch (error) {}
};

export const getAddManufacturer = async (req, res, next) => {
  res.render('create-form', {
    path: '',
    pageTitle: 'Create Manufacturer',
    label: 'Manufacturer Name',
  });
};

export const addManufacturer = async (req, res, next) => {
  try {
    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });
      console.log(details);
      return res.status(422).render('create-form', {
        path: '',
        pageTitle: 'Create Manufacturer',
        errorMessage: details[0].message,
        original: req.errors._original,
        label: 'Manufacturer Name',
      });
    }

    const manufacturer = await new Manufacturer({
      ...req.body,
      creator: req.session.user._id,
    }).save();

    res.send(manufacturer);
  } catch (error) {}
};

export const getUpdateManufacturer = async (req, res, next) => {
  const manufacturer = await Manufacturer.findById(req.params.id);

  res.render('create-form', {
    path: '',
    pageTitle: 'Update Manufacturer',

    original: manufacturer,
    label: 'Manufacturer Name',
  });
};

export const updateManufacturer = async (req, res, next) => {
  try {
    const manufacturer = await Manufacturer.findOne({ _id: req.params.id });

    if (!manufacturer) {
      return res.status(404).send('Not found');
    } else if (
      manufacturer.creator.toString() !== req.session.user._id.toString()
    ) {
      req.errors = new Joi.ValidationError('Not authorized', [
        {
          message: 'You cannot update manufacturer',
          path: ['name'],
          type: 'string.name',
          context: { key: 'name', label: 'name' },
        },
      ]);

      req.errors._original = manufacturer;
    }

    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });

      return res.status(422).render('create-form', {
        path: '',
        pageTitle: 'Update Manufacturer',
        errorMessage: details[0].message,
        original: req.errors._original,
        label: 'Manufacturer Name',
      });
    }

    const newManufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true },
    );

    res.redirect(newManufacturer.url);
  } catch (error) {}
};

export const deleteManufacturer = async (req, res, next) => {
  try {
    const manufacturer = await Manufacturer.findOne({ _id: req.params.id });

    if (!manufacturer) {
      return res.status(404).send('Not found');
    } else if (
      manufacturer.creator.toString() !== req.session.user._id.toString()
    ) {
      return res.status(403).send('Deletion not allowed');
    }

    const tires = await Tire.find({ manufacturer: req.params.id });

    if (!_.isEmpty(tires)) {
      req.session.error =
        'Cannot delete this manufacturer because of the existing tires below.';

      return res.redirect(manufacturer.url);

      //   setTimeout(() => {
      //     delete req.session.error;
      //     req.session.save(function (err) {});
      //   }, 2000);

      //   return;
    }

    await Manufacturer.findByIdAndDelete(req.params.id);

    res.send(manufacturer);
  } catch (error) {}
};

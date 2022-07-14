import Joi from 'joi';
import _ from 'lodash';
import { SystemZone } from 'luxon';
import Size from '../models/size_model.js';
import Tire from '../models/tire_model.js';

export const getSizes = async (req, res, next) => {
  try {
    const match = {};
    const owner = {};
    if (req.params.id) {
      match.creator = req.params.id;
      owner.creator = true;
    }

    const sizes = await Size.find(match).populate('tires');
    res.render('list', {
      pageTitle: 'All Sizes',
      items: sizes,
      size: true,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getSize = async (req, res, next) => {
  try {
    if (req.session.error) {
      res.locals.errorMessage = req.session.error;
    }
    const match = {};
    const owner = {};
    if (req.params.id) {
      match.creator = req.params.id;
    }

    const size = await Size.findById(req.params.id).populate('tires');
    const page = parseInt(req.query.page) || 1;

    if (size.creator._id.toString() === req.session.user._id.toString()) {
      owner.main = true;
    }

    const tires = await Tire.find({ size: req.params.id })
      .populate(['size', 'manufacturer', 'season', 'image'])
      .skip((page - 1) * 6)
      .limit(6);

    const count = size.tires.length;

    res.render('tire/tire_list', {
      pageTitle: 'All Tires',
      path: '/tires',
      subHeading: `/Size ${size.diameter}`,
      prods: tires,
      owner,
      item: size,
      currentPage: page,
      hasNext: 6 * page < count,
      hasPrevious: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(count / 6),
    });
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAddSize = async (req, res, next) => {
  res.render('create-form', {
    path: '',
    pageTitle: 'Create Size',
    label: 'Create Size',
    size: true,
  });
};

export const addSize = async (req, res, next) => {
  try {
    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });

      return res.render('create-form', {
        path: '',
        pageTitle: 'Create Size',
        errorMessage: details[0].message,
        original: req.errors._original,
        label: 'Create Size',
        size: true,
      });
    }

    const size = new Size({ ...req.body, creator: req.session.user._id });

    await size.save();

    res.redirect(size.url);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUpdateSize = async (req, res, next) => {
  const size = await Size.findById(req.params.id);

  res.render('create-form', {
    path: '',
    pageTitle: 'Update Size ',
    size: true,
    original: size,
    label: ' Diameter',
  });
};

export const updateSize = async (req, res, next) => {
  try {
    const size = await Size.findOne({ _id: req.params.id });

    if (!size) {
      return res.status(404).send('Not found');
    } else if (size.creator.toString() !== req.session.user._id.toString()) {
      req.errors = new Joi.ValidationError('Not authorized', [
        {
          message: 'You do not have the authority to update this Size',
          path: ['diameter'],

          context: { key: 'diameter', label: 'diameter' },
        },
      ]);

      req.errors._original = size;
    }

    if (req.errors) {
      const details = req.errors.details.map((detail) => {
        return { message: _.upperFirst(detail.message), path: detail.path[0] };
      });

      return res.status(422).render('create-form', {
        path: '',
        pageTitle: 'Update Size',
        errorMessage: details[0].message,
        original: req.errors._original,
        size: true,
        label: 'Diameter',
      });
    }

    const newSize = await Size.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );

    res.redirect(newSize.url);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteSize = async (req, res, next) => {
  try {
    const size = await Size.findOne({ _id: req.params.id });

    if (!size) {
      return res.status(404).send('Not found');
    } else if (size.creator.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Deletion not allowed');
    }

    const tires = await Tire.find({ size: req.params.id });

    if (!_.isEmpty(tires)) {
      req.session.error =
        'Cannot delete this size because of the existing tires below.';

      return res.redirect(size.url);
    }

    await Size.findByIdAndDelete(req.params.id);

    res.redirect('/sizes/mine');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

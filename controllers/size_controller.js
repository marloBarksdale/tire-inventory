import _ from 'lodash';
import { SystemZone } from 'luxon';
import Size from '../models/size_model.js';
import Tire from '../models/tire_model.js';

export const getSizes = async (req, res, next) => {
  try {
    const sizes = await Size.find();
    res.send(sizes);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getSize = async (req, res, next) => {
  try {
    const size = await Size.findById(req.params.id).populate('tires');

    res.send(size);
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

    res.send(size);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateSize = async (req, res, next) => {
  try {
    const exists = await Size.findOne({ diameter: req.body.diameter });

    if (exists) {
      return res.send('This size already exists: ' + exists.url);
    }

    const size = await Size.findOne({ _id: req.params.id });

    if (!size) {
      return res.status(404).send('Not found');
    } else if (size.creator.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Update not allowed');
    }

    const newSize = await Size.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );

    res.send(newSize);
  } catch {
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
      return res.send(
        'Cannot delete this Size because of existing tires' + tires,
      );
    }

    await Size.findByIdAndDelete(req.params.id);

    res.send(size);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

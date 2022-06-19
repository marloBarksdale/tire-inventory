import _ from 'lodash';
import Size from '../models/size_model.js';
import Tire from '../models/tire_model.js';

export const getSizes = async (req, res, next) => {
  try {
    const sizes = await Size.find();
    res.send(sizes);
  } catch (error) {}
};

export const getSize = async (req, res, next) => {
  try {
    const size = await Size.findById(req.params.id).populate('tires');

    res.send(size);
  } catch (error) {}
};

export const addSize = async (req, res, next) => {
  try {
    const size = new Size(req.body);

    const exists = await Size.findOne({ diameter: size.diameter });

    if (exists) {
      return res.send(exists.url);
    }

    await size.save();

    res.send(size);
  } catch (error) {}
};

export const updateSize = async (req, res, next) => {
  try {
    const exists = await Size.findOne({ diameter: req.body.diameter });

    if (exists) {
      return res.send('This size already exists: ' + exists.url);
    }

    const size = await Size.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );

    res.send(size);
  } catch {}
};

export const deleteSize = async (req, res, next) => {
  try {
    const tires = await Tire.find({ size: req.params.id });

    if (!_.isEmpty(tires)) {
      return res.send(
        'Cannot delete this Size because of existing tires' + tires,
      );
    }

    const size = await Size.findByIdAndDelete(req.params.id);

    res.send(size);
  } catch (error) {}
};

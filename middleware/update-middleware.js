import Tire from '../models/tire_model.js';
import mongoose from 'mongoose';

export const optionalUpdate = async (req, res, next) => {
  try {
    if (req.params.id) {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.send('Not found');
      }
    }

    const tire = await Tire.findById(req.params.id);

    if (!tire) {
      return res.status(404).send('Not found');
    }

    let { name, season, manufacturer, price, size } = tire;

    name = name.toString();
    season = season.toString();
    manufacturer = manufacturer.toString();
    size = size.toString();

    req.body = { name, season, manufacturer, price, size, ...req.body };

    next();
  } catch (error) {}
};

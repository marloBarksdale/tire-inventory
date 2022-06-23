import _ from 'lodash';
import Tire from '../models/tire_model.js';

export const optionalUpdate = async (req, res, next) => {
  try {
    const tire = await Tire.findById(req.params.id);

    if (!tire) {
      return res.send('not found');
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

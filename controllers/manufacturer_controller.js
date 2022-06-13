import _ from 'lodash';
import Manufacturer from '../models/manufacturer_model.js';
import Tire from '../models/tire_model.js';

export const getManufacturers = async (req, res, next) => {
  try {
    const manufacturers = await Manufacturer.find();

    res.send(manufacturers);
  } catch (error) {}
};

export const getManufacturer = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);

    res.send(manufacturer);
  } catch (error) {}
};

export const addManufacturer = async (req, res, next) => {
  try {
    const manufacturer = await new Manufacturer(req.body).save();

    res.send(manufacturer);
  } catch (error) {}
};

export const deleteManufacturer = async (req, res, next) => {
  try {
    const tires = await Tire.find({ manufacturer: req.params.id });

    if (!_.isEmpty(tires)) {
      return res.send(
        'Cannot delete this manufacturer because of existing tires:' + tires,
      );
    }

    const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);

    res.send(manufacturer);
  } catch (error) {}
};

import Manufacturer from '../models/manufacturer_model.js';

export const getManufacturers = async (req, res, next) => {
  try {
    const manufacturers = await Manufacturer.find();

    res.send(manufacturers);
  } catch (error) {}
};

export const getManufacturer = async (req, res, next) => {
  console.log('here');
  console.log(req.params.id);
  try {
    const manufacturer = await Manufacturer.findById(req.params.id).populate(
      'tires',
    );

    res.send({ manufacturer, tires: manufacturer.tires });
  } catch (error) {}
};

export const addManufacturer = async (req, res, next) => {
  try {
    const manufacturer = await new Manufacturer(req.body).save();

    res.send(manufacturer);
  } catch (error) {}
};

import Manufacturer from '../models/manufacturer_model.js';

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

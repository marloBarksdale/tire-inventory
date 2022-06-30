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
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);

    res.send(manufacturer);
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

    // const exists = await Manufacturer.findOne({ name: req.body.name });

    // if (exists) {
    //   return res.send(exists.url);
    // }

    const manufacturer = await new Manufacturer({
      ...req.body,
      creator: req.session.user._id,
    }).save();

    res.send(manufacturer);
  } catch (error) {}
};

export const updateManufacturer = async (req, res, next) => {
  try {
    const exists = await Manufacturer.findOne({ name: req.body.name });
    if (exists) {
      return res.send('This manufacturer already exists: ' + exists.url);
    }

    const manufacturer = await Manufacturer.findOne({ _id: req.params.id });

    if (!manufacturer) {
      return res.status(404).send('Not found');
    } else if (
      manufacturer.creator.toString() !== req.session.user._id.toString()
    ) {
      return res.status(404).send('Update not allowed');
    }

    const newManufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true },
    );

    res.send(newManufacturer);
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
      return res
        .status(403)
        .send(
          'Cannot delete this manufacturer because of existing tires:' + tires,
        );
    }

    await Manufacturer.findByIdAndDelete(req.params.id);

    res.send(manufacturer);
  } catch (error) {}
};

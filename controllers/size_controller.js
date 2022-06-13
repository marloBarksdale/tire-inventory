import Size from '../models/size_model.js';

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

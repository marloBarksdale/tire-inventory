import Tire from '../models/tire_model.js';

export const getTires = async (req, res, next) => {
  try {
    const tires = await Tire.find();

    res.send(tires);
  } catch (e) {}
};

export const getTire = async (req, res, next) => {
  try {
    const tire = await Tire.findById(req.params.id).populate([
      'manufacturer',
      'season',
      'size',
    ]);
    res.send(tire);
  } catch (error) {}
};

export const addTire = async (req, res, next) => {
  const { name, manufacturer, season, size } = req.body;

  try {
    const exists = await Tire.findOne({ name, manufacturer, season, size });
    if (exists) {
      return res.send(exists.url);
    }

    const tire = new Tire(req.body);

    await tire.save();
    res.send(tire);
  } catch (error) {}
};

export const updateTire = async (req, res, next) => {
  try {
    const tire = await Tire.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true },
    );
    res.send(tire);
  } catch (error) {}
};

export const deleteTire = async (req, res, next) => {
  try {
    const tire = await Tire.findByIdAndDelete(req.params.id);
    res.send(tire);
  } catch (error) {}
};

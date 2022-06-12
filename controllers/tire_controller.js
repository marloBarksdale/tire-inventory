import mongoose from 'mongoose';

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
  try {
    const tire = new Tire(req.body);

    await tire.save();
    res.send(tire);
  } catch (error) {}
};

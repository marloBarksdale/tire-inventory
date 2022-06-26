import Tire from '../models/tire_model.js';

export const getTires = async (req, res, next) => {
  try {
    const tires = await Tire.find({});

    res.send(tires);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getTire = async (req, res, next) => {
  try {
    const tire = await Tire.findById(req.params.id).populate([
      'manufacturer',
      'season',
      'size',
    ]);

    res.send(tire);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addTire = async (req, res, next) => {
  const { name, manufacturer, season, size } = req.body;

  try {
    const exists = await Tire.findOne({ name, manufacturer, season, size });
    if (exists) {
      return res.send(exists.url);
    }

    const tire = new Tire({ creator: req.session.user._id, ...req.body });

    await tire.save();
    res.send(tire);
  } catch (error) {
    res.status(406).send(error.message);
  }
};

export const updateTire = async (req, res, next) => {
  try {
    const { name, manufacturer, season, size } = req.body;

    const exists = await Tire.findOne({ name, manufacturer, season, size });

    if (exists) {
      return res.send('This tire alreadys exists: ' + exists.url);
    }

    const tire = await Tire.findById(req.params.id);

    if (!tire) {
      return res.status(404).send('Not found');
    } else if (tire.creator.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Update not allowed');
    }

    const newTire = await Tire.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true, runValidators: true },
    );
    res.send(newTire);
  } catch (error) {
    res.status(406).send(error.message);
  }
};

export const deleteTire = async (req, res, next) => {
  try {
    const tire = await Tire.findById(req.params.id);

    if (!tire) {
      return res.send('Not found');
    } else if (tire.creator.toString() !== req.session.user._id.toString()) {
      return res.send('Deletion not allowed');
    }

    await Tire.findByIdAndDelete(req.params.id);

    res.send(tire);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

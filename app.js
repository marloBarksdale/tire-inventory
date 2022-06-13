import Manufacturer from './models/manufacturer_model.js';
import Season from './models/season_model.js';
import Size from './models/size_model.js';
import Tire from './models/tire_model.js';
import manufacturerRouter from './routes/manufacturer_routes.js';
import seasonRouter from './routes/season_routes.js';
import sizeRouter from './routes/size_routes.js';
import tireRouter from './routes/tire_routes.js';
import { app } from './utils/init.js';
import _ from 'lodash';

app.use('/tires', tireRouter);
app.use('/manufacturers', manufacturerRouter);
app.use('/sizes', sizeRouter);
app.use('/seasons', seasonRouter);

app.use('/', (req, res) => {
  res.render('index', { title: 'Tire Inventory' });
});

// const run = async () => {
//   const sizes = await Size.find();
//   const manufacturers = await Manufacturer.find();
//   const seasons = await Season.find();

//   const tire = new Tire({
//     name: 'Tire 8',
//     price: 30,
//     season: _.sample(seasons)._id,
//     manufacturer: _.sample(manufacturers)._id,
//     size: _.sample(sizes)._id,
//   });

//   await tire.save();
// };

// run();

app.listen(process.env.PORT, () => {
  console.log(`Up on ${process.env.PORT}`);
});

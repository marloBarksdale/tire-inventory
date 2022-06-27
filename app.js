import auth from './middleware/auth.js';
import manufacturerRouter from './routes/manufacturer_routes.js';
import seasonRouter from './routes/season_routes.js';
import sizeRouter from './routes/size_routes.js';
import tireRouter from './routes/tire_routes.js';
import userRouter from './routes/user_routes.js';
import { app } from './utils/init.js';

app.use('/tires', auth, tireRouter);
app.use('/manufacturers', auth, manufacturerRouter);
app.use('/sizes', auth, sizeRouter);
app.use('/seasons', auth, seasonRouter);
app.use(userRouter);
app.use('/', auth, tireRouter);
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

// const run = async () => {
//   const users = await User.find();
//   const manufacturers = await Manufacturer.find();
//   const sizes = await Size.find();
//   const seasons = await Season.find();

//   for (let i = 1; i <= 20; i++) {
//     const tire = new Tire({
//       name: `Tire ${i}`,
//       season: _.sample(seasons, 1)._id,
//       manufacturer: _.sample(manufacturers, 1)._id,
//       size: _.sample(sizes, 1)._id,
//       price: Math.floor(120 + Math.random() * (200 - 120)),
//       creator: _.sample(users, 1)._id,
//       quantity: Math.floor(Math.random() * 100),
//     });
//     await tire.save();
//   }
// };

// run();
app.use((error, req, res, next) => {
  res.send(error);
});

app.listen(process.env.PORT, () => {
  console.log(`Up on ${process.env.PORT}`);
});

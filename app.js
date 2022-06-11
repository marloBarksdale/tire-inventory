import Manufacturer from './models/manufacturer_model.js';
import Size from './models/size_model.js';
import Tire from './models/tire_model.js';
import { app } from './utils/init.js';

app.use('/', (req, res) => {
  res.render('index', { title: 'Tire Inventory' });
});

const run = async () => {};

run();

app.listen(process.env.PORT, () => {
  console.log(`Up on ${process.env.PORT}`);
});

import { app } from './utils/init.js';

app.use('/', (req, res) => {
  res.render('index', { title: 'Tire Inventory' });
});

app.listen(process.env.PORT, () => {
  console.log(`Up on ${process.env.PORT}`);
});

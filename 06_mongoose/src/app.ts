import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

const main = async () => {
  try {
    const app = express();

    await mongoose.connect(process.env.DB_URI!);

    app.set('port', 3000);

    app.use(morgan('dev'));

    app.get('/', (req, res) => {
      res.send('Hello Express');
    });

    app.use((req, res) => {
      res.status(404).send('Not Found');
    });

    // eslint-disable-next-line no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err);

      res.status(500).send('Internal Server Error');
    });

    app.listen(app.get('port'), () => {
      console.log(`Server running at http://localhost:${app.get('port')}`);
    });
  } catch (err) {
    console.error(err);
  }
};

main();

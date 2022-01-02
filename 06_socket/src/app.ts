import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set('port', 3000);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(404).send('Not Found');
});

// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).send('Internal Server Error');
});

io.on('connection', (socket) => {
  console.log(`Connected User: ${socket.id}`);

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('error', (err) => {
    console.error(err);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected User: ${socket.id}`);
  });
});

server.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});
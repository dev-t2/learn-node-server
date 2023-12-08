import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

interface IUser {
  id: number;
  nickname: string;
}

let users: IUser[] = [];

const port = 8080;

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.get('/users', (req, res) => {
  return res.json({ users });
});

interface IRequestFindUser extends Request {
  params: { id: string };
}

app.get('/users/:id', (req: IRequestFindUser, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    return res.status(404).send('Not Found');
  }

  return res.json(findUser);
});

interface IRequestCreateUser extends Request {
  body: { nickname?: string };
}

app.post('/users', (req: IRequestCreateUser, res) => {
  const { nickname } = req.body;

  if (!nickname?.trim()) {
    return res.status(400).send('Bad Request');
  }

  const isExistsNickname = users.find((user) => user.nickname === nickname);

  if (isExistsNickname) {
    return res.status(400).send('Bad Request');
  }

  const id = users.length ? users[users.length - 1].id + 1 : 1;
  const user: IUser = { id, nickname };

  users = [...users, user];

  return res.status(201).json(user);
});

interface IRequestUpdateUser extends Request {
  params: { id: string };
  body: { nickname?: string };
}

app.put('/users/:id', (req: IRequestUpdateUser, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const { nickname } = req.body;

  if (!nickname?.trim()) {
    return res.status(400).send('Bad Request');
  }

  const isExistsNickname = users.find((user) => user.nickname === nickname);

  if (isExistsNickname) {
    return res.status(400).send('Bad Request');
  }

  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    return res.status(404).send('Not Found');
  }

  users = users.map((user) => {
    return user.id === findUser.id ? { ...user, nickname } : user;
  });

  return res.status(204).json({});
});

interface IRequestDeleteUser extends Request {
  params: { id: string };
}

app.delete('/users/:id', (req: IRequestDeleteUser, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Bad Request');
  }

  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    return res.status(404).send('Not Found');
  }

  users = users.filter((user) => user.id !== findUser.id);

  return res.status(204).json({});
});

app.use((req, res) => {
  return res.status(404).send('Not Found');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  return res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Listening and serving HTTP on :${port}`);
});

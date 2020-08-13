import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import clientsRouter from './clientsRouter.js';
import contactsRouter from './contactsRouter.js';

const { readFile, writeFile } = fs;

global.readFile = readFile;
global.writeFile = writeFile;

const PORT = 8080;
const HOST = '0.0.0.0';

global.__dirname = path.resolve(path.dirname(''));
global.staticPath = __dirname + '/views/';

const app = express();
const indexRouter = express.Router();

app.use(express.json());

indexRouter.use((req, res, next) => {
  console.log('/' + req.method);
  next();
});

indexRouter.get((req, res) => {
  res.sendFile(staticPath + 'index.html');
});

app.use(express.static(staticPath));

app.use('/', indexRouter);
app.use('/clients', clientsRouter);
app.use('/contacts', contactsRouter);

const createJson = async () => {
  try {
    await readFile('./clients.json');
  } catch (ex) {
    const initialClientsJson = {
      nextId: 1,
      clients: [],
    };

    writeFile('./clients.json', JSON.stringify(initialClientsJson))
      .then(() => console.log('Clients JSON file created'))
      .catch((ex) => console.log(`Error creating Clients JSON file: ${ex}`));
  }

  try {
    await readFile('./contacts.json');
  } catch (ex) {
    const initialContactsJson = {
      nextId: 1,
      contacts: [],
    };

    writeFile('./contacts.json', JSON.stringify(initialContactsJson))
      .then(() => console.log('Contacts JSON file created'))
      .catch((ex) => console.log(`Error creating Contatacts JSON file: ${ex}`));
  }
};

app.listen(PORT, HOST, async () => {
  await createJson();
  console.log(`Server running on port ${PORT}`);
});

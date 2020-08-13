import express from 'express';

const clientsRouter = express.Router();

const file = './data/clients.json';

clientsRouter.use(express.json());

clientsRouter.get('/', (req, res) => {
  res.sendFile(staticPath + 'clients.html');
});

clientsRouter.get('/all', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(file));
    delete data.nextId;

    res.send(data);
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

clientsRouter.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(file));

    const client = data.clients.find(
      (cli) => cli.id === parseInt(req.params.id),
    );

    res.send(client);
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

clientsRouter.post('/', async (req, res) => {
  try {
    let client = req.body;

    if (
      !client.name ||
      !client.surname ||
      !client.mail ||
      !client.phone ||
      !client.date ||
      !client.contact
    ) {
      throw new Error('Name, Surname, Mail, Phone, Date, Contact are required');
    }

    const data = JSON.parse(await readFile(file));

    client = {
      id: data.nextId++,
      name: client.name,
      surname: client.surname,
      mail: client.mail,
      phone: client.phone,
      date: client.date,
      contact: client.contact,
    };
    data.clients.push(client);

    await writeFile(file, JSON.stringify(data, null, 2));

    res.send(client);
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

clientsRouter.delete('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(file));
    data.clients = data.clients.filter(
      (client) => client.id !== parseInt(req.params.id),
    );

    await writeFile(file, JSON.stringify(data, null, 2));

    res.end();
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

clientsRouter.put('/', async (req, res) => {
  try {
    let client = req.body;

    if (
      !client.name ||
      !client.surname ||
      !client.mail ||
      !client.phone ||
      !client.date ||
      !client.contact
    ) {
      throw new Error('Name, Surname, Mail, Phone, Date, Contact are required');
    }

    const data = JSON.parse(await readFile(file));

    const index = data.clients.findIndex(
      (cli) => cli.id === parseInt(client.id),
    );

    if (index === -1) {
      throw new Error('Record not found');
    }

    data.clients[index] = client;

    await writeFile(file, JSON.stringify(data, null, 2));

    res.send(data);
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

export default clientsRouter;

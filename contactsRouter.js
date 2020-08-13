import express from 'express';

const contactsRouter = express.Router();

contactsRouter.use(express.json());

contactsRouter.get('/', (req, res) => {
  res.sendFile(staticPath + 'contacts.html');
});

contactsRouter.get('/all', async (req, res) => {
  try {
    const data = JSON.parse(await readFile('./contacts.json'));
    delete data.nextId;

    res.send(data);
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

contactsRouter.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile('./contacts.json'));

    const contact = data.contacts.find(
      (ctt) => ctt.id === parseInt(req.params.id),
    );

    res.send(contact);
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

contactsRouter.post('/', async (req, res) => {
  try {
    let contact = req.body;

    if (!contact.name || !contact.surname || !contact.mail || !contact.phone) {
      throw new Error('Name, Surname, Mail, Phone are required');
    }

    const data = JSON.parse(await readFile('./contacts.json'));

    contact = {
      id: data.nextId++,
      name: contact.name,
      surname: contact.surname,
      mail: contact.mail,
      phone: contact.phone,
    };
    data.contacts.push(contact);

    await writeFile('./contacts.json', JSON.stringify(data, null, 2));

    res.send(contact);
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

contactsRouter.delete('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile('./contacts.json'));
    data.contacts = data.contacts.filter(
      (contact) => contact.id !== parseInt(req.params.id),
    );

    await writeFile('./contacts.json', JSON.stringify(data, null, 2));

    res.end();
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

contactsRouter.put('/', async (req, res) => {
  try {
    let contact = req.body;

    if (!contact.name || !contact.surname || !contact.mail || !contact.phone) {
      throw new Error('Name, Surname, Mail, Phone are required');
    }

    const data = JSON.parse(await readFile('./contacts.json'));

    const index = data.contacts.findIndex(
      (ctt) => ctt.id === parseInt(contact.id),
    );

    if (index === -1) {
      throw new Error('Record not found');
    }

    data.contacts[index] = contact;

    await writeFile('./contacts.json', JSON.stringify(data, null, 2));

    res.send(data);
  } catch (ex) {
    res.status(400).send({ error: ex.message });
  }
});

export default contactsRouter;

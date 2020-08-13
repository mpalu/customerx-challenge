window.addEventListener('load', start);

const name = document.querySelector('#name');
const surname = document.querySelector('#surname');
const mail = document.querySelector('#mail');
const phone = document.querySelector('#phone');
const date = document.querySelector('#date');
const contactList = document.querySelector('#contactList');
const submit = document.querySelector('#submit');

let clients = [];
let contacts = [];
let clientContact = [];

async function start() {
  await fetchContacts();
  await fetchClients();
  render();
}

async function fetchContacts() {
  try {
    const response = await fetch('http://localhost:8080/contacts/all');
    const data = await response.json();

    contacts = data.contacts.map((contact) => contact);
  } catch (err) {
    console.log(err);
    return;
  }
}

async function fetchClients() {
  try {
    const response = await fetch('http://localhost:8080/clients/all');
    const data = await response.json();

    clients = data.clients.map((client) => client);
  } catch (err) {
    console.log(err);
    return;
  }
}

function getSelectedContacts() {
  clientContact = [];
  const options = document.querySelectorAll('option').forEach((option) => {
    if (option.selected) {
      clientContact.push(parseInt(option.value));
    }
  });
}

async function createClient() {
  getSelectedContacts();

  if (
    name.value &&
    surname.value &&
    mail.value &&
    phone.value &&
    date.value &&
    clientContact.length > 0
  ) {
    const data = {
      name: name.value,
      surname: surname.value,
      mail: mail.value,
      phone: phone.value,
      date: date.value,
      contact: clientContact,
    };

    try {
      const request = await fetch('http://localhost:8080/clients', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data, null, 2),
      }).then((res) => {
        if (res.status === 200) {
          window.alert('Dados cadastrados com sucesso');
          clientContact = [];
          clearInput();
          start();
        } else {
          throw new Error(res);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}

async function editClient(id) {
  submit.removeEventListener('click', createClient);

  getSelectedContacts();

  const options = document.querySelectorAll('option').forEach((option) => {
    option.addEventListener('click', getSelectedContacts);
  });

  let client = {};

  clients.forEach((cli) => {
    if (cli.id === id) {
      client = {
        name: cli.name,
        surname: cli.surname,
        mail: cli.mail,
        phone: cli.phone,
        date: cli.date,
        contact: clientContact,
      };
    }
  });

  name.value = client.name;
  surname.value = client.surname;
  mail.value = client.mail;
  phone.value = client.phone;
  date.value = client.date;

  submit.addEventListener('click', () => {
    if (
      name.value &&
      surname.value &&
      mail.value &&
      phone.value &&
      date.value &&
      clientContact.length > 0
    ) {
      update();
    }
  });

  async function update() {
    const data = {
      id: id,
      name: name.value,
      surname: surname.value,
      mail: mail.value,
      phone: phone.value,
      date: date.value,
      contact: clientContact,
    };

    try {
      const request = await fetch('http://localhost:8080/clients', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data, null, 2),
      }).then((res) => {
        if (res.status === 200) {
          window.alert('Dados atualizados com sucesso');
          clearInput();
          submit.removeEventListener('click', update);
          const options = document
            .querySelectorAll('option')
            .forEach((option) => {
              option.addEventListener('click', getSelectedContacts);
            });
          start();
        } else {
          throw new Error(res);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}

async function deleteClient(id) {
  try {
    const request = await fetch(`http://localhost:8080/clients/${id}`, {
      method: 'delete',
    }).then((res) => {
      if (res.status === 200) {
        window.alert('Cliente excluído com sucesso');
        clearInput();
        start();
      } else {
        throw new Error(res);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function preventSubmit(event) {
  event.preventDefault();
}

function clearInput() {
  name.value = '';
  surname.value = '';
  mail.value = '';
  phone.value = '';
  date.value = '';
  name.focus();
}

async function render() {
  const table = document.querySelector('#table');

  document.querySelector('form').addEventListener('submit', preventSubmit);
  submit.addEventListener('click', createClient);

  if (clients.length === 0) {
    document.querySelector('h2').classList.add('d-none');
    document.querySelector('table').classList.add('d-none');
  } else {
    document.querySelector('h2').classList.remove('d-none');
    document.querySelector('table').classList.remove('d-none');
  }

  contactList.innerHTML = `
  ${contacts
    .map((contact) => {
      return `
      <option value="${contact.id}" style="padding: 5px"><b>${contact.name} ${contact.surname} &nbsp &nbsp 	&lt;${contact.mail}&gt; &nbsp &nbsp	&lt;${contact.phone}&gt;</option>
    `;
    })
    .join('')}
  `;

  table.innerHTML = `
  ${clients
    .map((client) => {
      return `
      <tr>
      <th scope="row">${client.id}</th>
      <td>${client.name} ${client.surname}</td>
      <td>${client.mail}</td>
      <td>${client.phone}</td>
      <td>${contacts
        .map((contact) => {
          if (contact.id === parseInt(client.contact)) {
            return ` ${contact.name} ${contact.surname} <br /> ${contact.mail} <br /> ${contact.phone} <br /> <br /> `;
          }
        })
        .join('')}
      </td>
      <td>
        <button onclick="editClient(${
          client.id
        })" class="btn btn-warning" type="submit">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
          </svg>
        </button>
        <button onclick="deleteClient(${
          client.id
        })" class="btn btn-danger" type="submit"> <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
          </svg>
        </button>
      </td>
    </tr>
    `;
    })
    .join('')}
  `;
}

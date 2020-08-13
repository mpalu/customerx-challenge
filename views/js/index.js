window.addEventListener('load', start);

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

async function render() {
  const table = document.querySelector('#table');

  if (clients.length === 0) {
    document.querySelector('h1').textContent = 'Nenhum cliente cadastrado';
    document.querySelector('table').classList.add('d-none');
  } else {
    document.querySelector('h1').textContent = 'Lista de clientes';
    document.querySelector('table').classList.remove('d-none');
  }

  table.innerHTML = `
  ${clients
    .map((client) => {
      return `
      <tr>
      <th scope="row">${client.id}</th>
      <td>${client.name} ${client.surname}</td>
      <td>${client.mail}</td>
      <td>${client.phone}</td>
      <td>${client.contact}</td>
    </tr>
    `;
    })
    .join('')}
  `;
}

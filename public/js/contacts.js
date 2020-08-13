window.addEventListener('load', start);

const name = document.querySelector('#name');
const surname = document.querySelector('#surname');
const mail = document.querySelector('#mail');
const phone = document.querySelector('#phone');
const submit = document.querySelector('#submit');

let contacts = [];

async function start() {
  await fetchContacts();
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

async function createContact() {
  if (name.value && surname.value && mail.value && phone.value) {
    const data = {
      name: name.value,
      surname: surname.value,
      mail: mail.value,
      phone: phone.value,
    };

    try {
      const request = await fetch('http://localhost:8080/contacts', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data, null, 2),
      }).then((res) => {
        if (res.status === 200) {
          window.alert('Dados cadastrados com sucesso');
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

async function editContact(id) {
  submit.removeEventListener('click', createContact);

  let contact = {};

  contacts.forEach((ctt) => {
    if (ctt.id === id) {
      contact = {
        name: ctt.name,
        surname: ctt.surname,
        mail: ctt.mail,
        phone: ctt.phone,
      };
    }
  });

  name.value = contact.name;
  surname.value = contact.surname;
  mail.value = contact.mail;
  phone.value = contact.phone;

  submit.addEventListener('click', update);

  async function update() {
    const data = {
      id: id,
      name: name.value,
      surname: surname.value,
      mail: mail.value,
      phone: phone.value,
    };

    try {
      const request = await fetch('http://localhost:8080/contacts', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data, null, 2),
      }).then((res) => {
        if (res.status === 200) {
          window.alert('Dados atualizados com sucesso');
          submit.removeEventListener('click', update);
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

async function deleteContact(id) {
  try {
    const request = await fetch(`http://localhost:8080/contacts/${id}`, {
      method: 'delete',
    }).then((res) => {
      if (res.status === 200) {
        window.alert('Contato excluído com sucesso');
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
  name.focus();
}

async function render() {
  const table = document.querySelector('#table');

  document.querySelector('form').addEventListener('submit', preventSubmit);
  submit.addEventListener('click', createContact);

  if (contacts.length === 0) {
    document.querySelector('h2').classList.add('d-none');
    document.querySelector('table').classList.add('d-none');
  } else {
    document.querySelector('h2').classList.remove('d-none');
    document.querySelector('table').classList.remove('d-none');
  }

  table.innerHTML = `
  ${contacts
    .map((contact) => {
      return `
      <tr>
      <th scope="row">${contact.id}</th>
      <td>${contact.name} ${contact.surname}</td>
      <td>${contact.mail}</td>
      <td>${contact.phone}</td>
      <td>
        <button onclick="editContact(${contact.id})" class="btn btn-warning" type="submit">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
          </svg>
        </button> 
        <button onclick="deleteContact(${contact.id})" class="btn btn-danger" type="submit"> <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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

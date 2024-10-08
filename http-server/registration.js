 
const element = (id) => document.getElementById(id);
const classes = (classes) => document.getElementsByClassName(classes);

let userEntries = JSON.parse(localStorage.getItem('user_entries')) || [];

const username = element('name'),
  email = element('email'),
  password = element('password'),
  dob = element('dob'),
  tc = element('tc'),
  form = element('form'),
  table = element('user-table');

const errormsg = classes('errormsg');

const messages = {
  name: 'Username must be at least 3 characters long',
  email: 'Not a valid E-mail',
  dob: 'Your age must be between 18 and 55 to continue',
  tc: 'You must agree to the terms and conditions',
};

// Verifies field validity and applies custom validation
const verify = (elem, message, condition) => {
  elem.style.border = condition ? '2px solid red' : '2px solid green';
  elem.setCustomValidity(condition ? message : '');
  if (condition) elem.reportValidity();
};

// Check if DOB is within the valid age range
const checkDOB = () => {
  const age = new Date().getFullYear() - new Date(dob.value).getFullYear();
  return age >= 18 && age <= 55;
};

// Event listeners for form fields
username.addEventListener('input', (e) => {
  verify(username, messages.name, username.value.length < 3);
});

email.addEventListener('input', (e) => {
  verify(
    email,
    messages.email,
    !(email.value.includes('@') && email.value.includes('.')),
  );
});

dob.addEventListener('input', (e) => {
  verify(dob, messages.dob, !checkDOB());
});

tc.addEventListener('input', (e) => {
  verify(tc, messages.tc, !tc.checked);
});

// Create user entry object
const makeObject = () => ({
  name: username.value,
  email: email.value,
  password: password.value,
  dob: dob.value,
  checked: tc.checked,
});

// Display user entries in the table
const displayTable = () => {
  const rows = userEntries
    .map(
      ({ name, email, password, dob, checked }) =>
        `<tr>
          <td>${name}</td>
          <td>${email}</td>
          <td>${password}</td>
          <td>${dob}</td>
          <td>${checked}</td>
        </tr>`,
    )
    .join('');

  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Password</th>
      <th>Dob</th>
      <th>Accepted terms?</th>
    </tr>
    ${rows}
  `;
};

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (tc.checked) {
    userEntries.push(makeObject());
    localStorage.setItem('user_entries', JSON.stringify(userEntries));
    displayTable();
  }
});

// Display the table on page load
window.onload = displayTable;

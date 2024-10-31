function signup(ev) {
  // ev.preventDefault();
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;
  const username = document.querySelector('input[type="text"]').value;
  const email_error = document.querySelector('.email-error');
  const password_error = document.querySelector('.pass-error');
  const username_error = document.querySelector('.user-error');
  let willSubmit = { email: false, pass: false, user: false };
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    email_error.textContent = 'Invalid email provided';
    willSubmit.email = false;
  } else {
    email_error.textContent = '';
    willSubmit.email = true;
  }
  if (!/^[a-zA-Z0-9._-]{3,20}$/.test(username)) {
    username_error.textContent = "Username can't contain special character";
    willSubmit.user = false;
  } else {
    username_error.textContent = '';
    willSubmit.user = true;
  }
  if (password.length < 6) {
    password_error.textContent = 'Password too short';
    willSubmit.pass = false;
  } else {
    password_error.textContent = '';
    willSubmit.pass = true;
  }
  if (willSubmit.email && willSubmit.pass && willSubmit.user) return true;
  return false;
}

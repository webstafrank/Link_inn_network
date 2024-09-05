// Auth Script

const authForm = document.getElementById('auth-form');
const signupLink = document.getElementById('signup-link');
const signupForm = document.getElementById('signup-form');

signupLink.addEventListener('click', () => {
  authForm.style.display = 'none';
  signupForm.style.display = 'block';
});

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const phoneNumber = document.getElementById('phone-number').value;
  const verificationCode = document.getElementById('verification-code').value;
  // Add authentication logic here
  console.log(`Phone Number: ${phoneNumber}, Verification Code: ${verificationCode}`);
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const phoneNumber = document.getElementById('phone-number').value;
  const verificationCode = document.getElementById('verification-code').value;
  // Add signup logic here
  console.log(`Name: ${name}, Phone Number: ${phoneNumber}, Verification Code: ${verificationCode}`);
});

// Dashboard Script

const dashboardLink = document.getElementById('dashboard-link');

dashboardLink.addEventListener('click', () => {
  // Add dashboard logic here
  console.log('Dashboard link clicked');


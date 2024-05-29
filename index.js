const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = require('./config/db.local.config');
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('error'));

  const { verifyRoles } = require('./middleware/VerifyToken')

const {register, login, logout, forgotPasswordOTP, resetPasswordOTP} = require('./controller/UserController');
const {registerAdmin, getUsers} = require('./controller/AdminController');
const prefix = '/api/v1/';
// AUTH USER
app.post(prefix + 'register', register);
app.post(prefix + 'login', login);
app.delete(prefix + 'logout', logout);
app.post(prefix + 'forgot-password', forgotPasswordOTP);
app.post(prefix + 'reset-password', resetPasswordOTP);

// AUTH ADMIN
app.post(prefix + 'register-admin', registerAdmin);
app.get(prefix + 'all-users',  verifyRoles(['admin']),getUsers);

app.get('/', (req, res) => {
  res.send('Ok! Server Running!');
});

app.listen(3000, () => {
  console.log('Server Started');
  console.log(`Server Running on http://localhost:${port}`)
});
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

const {register, login, logout} = require('./controller/UserController');
const prefix = '/api/v1/';
// AUTH USER
app.post(prefix + 'register', register);
app.post(prefix + 'login', login);
app.delete(prefix + 'logout', logout);

app.get('/', (req, res) => {
  res.send('Ok! Server Running!');
});

app.listen(3000, () => {
  console.log('Server Started');
  console.log(`Server Running on http://localhost:${port}`)
});
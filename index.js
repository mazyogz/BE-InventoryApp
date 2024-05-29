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

const { verifyRoles, verifyUser } = require('./middleware/VerifyToken')

const {register, login, logout, forgotPasswordOTP, resetPasswordOTP, editUsers} = require('./controller/UserController');
const {registerAdmin, getUsers, getTotalCustomers, getAllProduct, getAllTotalProduct, getAllCategory, getTotalCategories} = require('./controller/AdminController');
const { getAvailProduct, getProductById, getProductByCategory } = require('./controller/DashboardController')
const prefix = '/api/v1/';
// AUTH USER
app.post(prefix + 'register', register);
app.post(prefix + 'login', login);
app.delete(prefix + 'logout', logout);
app.post(prefix + 'forgot-password', forgotPasswordOTP);
app.post(prefix + 'reset-password', resetPasswordOTP);
app.post(prefix + 'update-user', verifyUser ,editUsers);

// AUTH ADMIN & KEUANGAN
app.post(prefix + 'register-admin', registerAdmin);
app.get(prefix + 'all-users',  verifyRoles(['admin']), getUsers);
app.get(prefix + 'total-customers',  verifyRoles(['admin', 'keuangan']), getTotalCustomers);
app.get(prefix + 'all-product',  verifyRoles(['admin', 'keuangan']), getAllProduct);
app.get(prefix + 'all-total-product',  verifyRoles(['admin', 'keuangan']), getAllTotalProduct);
app.get(prefix + 'all-categories',  verifyRoles(['admin', 'keuangan']), getAllCategory);
app.get(prefix + 'total-categories',  verifyRoles(['admin', 'keuangan']), getTotalCategories);

// DASHBOARD
app.get(prefix + 'product', getAvailProduct);
app.get(prefix + 'product-id/:productId', getProductById);
app.get(prefix + 'product/:category', getProductByCategory);

app.get('/', (req, res) => {
  res.send('Ok! Server Running!');
});

app.listen(3000, () => {
  console.log('Server Started');
  console.log(`Server Running on http://localhost:${port}`)
});
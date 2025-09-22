const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, customerController.homepage);
router.get('/about', authMiddleware, customerController.about);
router.get('/add', authMiddleware, customerController.addCustomer);
router.post('/add', authMiddleware, customerController.postCustomer);

router.get('/view/:id', authMiddleware, customerController.view);
router.get('/edit/:id', authMiddleware, customerController.edit);
router.put('/edit/:id', authMiddleware, customerController.editPost);
router.delete('/edit/:id', authMiddleware, customerController.deleteCustomer);

router.post('/search', authMiddleware, customerController.searchCustomers);

// ----------  NOVA ROTA DO MODAL  ----------
router.post('/appointments', customerController.createAppointment);
// rotas de agendamento
router.post('/appointments', customerController.createAppointment);
router.get('/appointments/json', customerController.getAppointmentsJson); // <-- novo

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);
router.post('/register', authController.register);

module.exports = router;

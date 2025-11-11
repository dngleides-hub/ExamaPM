const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nome deve ter no mínimo 3 caracteres')
    .notEmpty()
    .withMessage('Nome é obrigatório'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email é obrigatório'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  body('role')
    .optional()
    .isIn(['admin', 'client'])
    .withMessage('Role deve ser admin ou client')
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .notEmpty()
    .withMessage('Email é obrigatório'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
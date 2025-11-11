const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');
const upload = require('../middlewares/upload');

const validateBook = [
  body('title')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Título deve ter no mínimo 2 caracteres')
    .notEmpty()
    .withMessage('Título é obrigatório'),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Autor é obrigatório'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Descrição deve ter no mínimo 10 caracteres')
    .notEmpty()
    .withMessage('Descrição é obrigatória'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Categoria é obrigatória'),
  body('isbn')
    .optional()
    .trim(),
  body('publishedYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Ano de publicação inválido')
];

router.post(
  '/',
  authMiddleware,
  checkRole('admin'),
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
  ]),
  validateBook,
  bookController.createBook
);

router.get('/', authMiddleware, bookController.getAllBooks);

router.get('/:id', authMiddleware, bookController.getBookById);

router.delete(
  '/:id',
  authMiddleware,
  checkRole('admin'),
  bookController.deleteBook
);

module.exports = router;
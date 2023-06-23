const express = require('express');
const mainController = require('../controllers/main');
const validation = require('../middlewares/userValidation');
const userCheck = require('../middlewares/userCheck')

const router = express.Router();

router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', mainController.register);
router.post('/users/register', validation.validationRegister, mainController.processRegister);
router.get('/users/login', mainController.login);
router.get('/users/logout', mainController.logout);
router.post('/users/login', validation.validationLogin, mainController.processLogin);
router.delete('/books/:id', userCheck, mainController.deleteBook);
router.get('/books/edit/:id', userCheck, mainController.edit);
router.put('/books/edit/:id', userCheck, mainController.processEdit);

module.exports = router;

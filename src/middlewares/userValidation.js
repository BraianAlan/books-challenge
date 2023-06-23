const path = require('path');
const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { check, body } = require('express-validator');
module.exports = {
  validationLogin: [
    check('email')
      .notEmpty()
      .withMessage('Escribe un email')
      .bail()
      .isEmail()
      .withMessage('Debes escribir un email válido'),
    check('password')
      .notEmpty()
      .withMessage('Escribe una contraseña')
      .isLength({ min: 8 })
      .withMessage('La contraseña es muy corta')
      .bail()
      .isAlphanumeric()
      .withMessage('La contraseña debe contener letras y números'),
    body('password').custom((value, { req }) => {
      return db.User.findOne({
        where: {
          email: req.body.email,
        },
      }).then((user) => {
        if (!bcryptjs.compareSync(value, user.Pass)) {
          return Promise.reject();
        }
      }).catch(() => { return Promise.reject('Email o contraseña incorrecta') });
    }),
  ],
  validationRegister: [
    check('name').notEmpty().withMessage('Debes escribir un nombre'),
    check('email')
      .notEmpty()
      .withMessage('Escribe un email')
      .bail()
      .isEmail()
      .withMessage('Debes escribir un email válido'),
    check('country')
      .notEmpty()
      .withMessage('Debes indicar un país')
      .bail()
      .isLength({ min: 3 })
      .withMessage('Debes indicar un país'),
    check('password')
      .notEmpty()
      .withMessage('Escribe una contraseña')
      .isLength({ min: 8 })
      .withMessage('La contraseña es muy corta')
      .bail()
      .isAlphanumeric()
      .withMessage('La contraseña debe contener letras y números'),
    check('category').notEmpty().withMessage('Debes elegir una opción'),
  ],
};

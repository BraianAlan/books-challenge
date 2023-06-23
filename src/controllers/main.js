const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const session = require('express-session');
const { DATE } = require('sequelize');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books, session: req.session });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: async (req, res) => {
    // Implement look for details in the database
    let book = await db.Book.findByPk(req.params.id, { include: [{ association: "authors" }] });
    let authors = book.authors.map((author) => { return author.name });
    res.render('bookDetail', { book, authors, session: req.session });
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [], session: req.session });
  },
  bookSearchResult: async (req, res) => {
    let books = await db.Book.findAll({
      where: { title: { [Op.like]: '%' + req.body.title + '%' } },
      include: [{ association: 'authors' }],
    });
    res.render('search', { books, session: req.session })
  },
  deleteBook: async (req, res) => {
    // Implement delete book
    await db.Book.destroy({
      where: { id: req.params.id },
    });
    res.redirect('/');
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => { res.render('authors', { authors, session: req.session }) })
      .catch((error) => console.log(error))
  },
  authorBooks: async (req, res) => {
    // Implement books by author
    let author = await db.Author.findByPk(req.params.id, { include: [{ association: 'books' }] });
    let books = author.books;
    res.render('authorBooks', { books, session: req.session });
  },
  register: (req, res) => {
    res.render('register', { session: req.session });
  },
  processRegister: async (req, res) => {
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      await db.User.create({
        Name: req.body.name,
        Email: req.body.email,
        Country: req.body.country,
        Pass: bcryptjs.hashSync(req.body.password, 10),
        CategoryId: req.body.category,
      });
      res.redirect('/');
    } else {
      return res.render('register', {
        messageError: errors.mapped(),
        old: req.body,
        session: req.session,
      });
    }
  },
  login: (req, res) => {
    // Implement login process
    res.render('login', { session: req.session });
  },
  processLogin: async (req, res) => {
    // Implement login process
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      const user = await db.User.findOne({ where: { email: req.body.email } });
      if (user.Email === req.body.email) {
        let userSession = {
          name: user.Name,
          email: user.Email,
          id: user.id,
          isAdmin: user.CategoryId === 1 ? true : false,
        };
        req.session.user = userSession;
        if (req.body.remember) {
          let timeCookies = new Date(Date.now() + 60000)
          res.cookie('userLogin', userSession, {
            expires: timeCookies, httpOnly: true
          })
        }
        console.log('usuario ' + user.Email + ' encontrado');
        res.redirect('/');
      }
    } else {
      return res.render("login", {
        messageError: errors.mapped(),
        old: req.body,
        session: req.session
      });
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    if (req.cookies.userLogin) {
      res.cookie('userLogin', '', {maxAge:-1});
    };
    res.redirect('/')
  },
  edit: async(req, res) => {
    // Implement edit book
    let book = await db.BookfindByPk(req.params.id, {include: [{association: 'authors'}]});
    res.render('editBook', { book, session: req.session })
  },
  processEdit: async(req, res) => {
    // Implement edit book
    let bookToEdit = {
      title: req.bpdy.title,
      description: req.body.description,
      cover: req.body.cover,
    };
    await this.bookDetail.Book.update(bookToEdit, {where: {id: req. params.id}});
    res.redirect('/');
  }
};

module.exports = mainController;

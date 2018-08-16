var express = require('express');
var router = express.Router();
const sequelize = require('../models').sequelize;
const Op = sequelize.Op;
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const myFunc = require('../js/myFunc');

let state;

router.get('/', function(req, res, next) {
  if (req.query.filter === 'overdue') {
    Loan
      .findAll({ 
        where: {
          [Op.and]: {
            return_by: { [Op.lt]: `${new Date()}` },
            returned_on: { [Op.eq]: null }
          }
        },
        include: { model: Book }
      })
      .then(loans => res.render('books/list', {
        books: loans.map(i => i.Book),
        overdue: true,
        booksPage: true
      }))
      .catch(next)
  }
  else if (req.query.filter === 'checked_out') {
    Loan
      .findAll({
        where: { returned_on: { [Op.eq]: null } },
        include: { model: Book }
      })
      .then(loans => res.render('books/list', {
        books: loans.map(i => i.Book),
        checked_out: true,
        booksPage: true
      }))
      .catch(next)
  }
  else res.redirect('/books/page/1');
});

// router.get('/all', function (req, res, next) {
//   Book
//     .findAll()
//     .then(books => res.render('books/list', {
//       books,
//       all: true,
//       booksPage: true,
//       perPage: 4
//     }))
//     .catch(next)
// });

router.get('/new', function (req, res, next) {
  res.render('books/new', { booksPage: true });
});

/* --- Pagination route --- */
router.get('/page/:id', function (req, res, next) {
  const perPage = 10;
  Promise
    .all([
      Book.findAll({
        offset: perPage * (req.params.id - 1), 
        limit: perPage,
        order: [['id', 'DESC']]
      }),
      Book.findAndCountAll(),
    ])
    .then(myFunc.log)
    .then(r => {
      return (r[0].length === 0) ?
        next(new Error('Page not found :/'))
        :
        r;
    })
    .then(r => res.render('books/list', {
      books: r[0],
      totalItems: r[1].count,
      all: true,
      booksPage: true,
      perPage,
      currentPageId: req.params.id
    }))
    .catch(next)
});

router.get('/:id', (req, res, next) => {
  Promise
    .all([
      Book.findById(req.params.id),
      Loan.findAll({ 
        where: { book_id: { [Op.eq]: req.params.id } },
        include: { model: Patron }
      })
    ])
    .then(myFunc.log)
    .then(results => {
      return (results[0] === null) ?
        next(new Error('Page not found :/'))
        :
        results;
    })
    .then(results => [results[0], myFunc.formatDate(results[1])])
    .then(results => state = results)
    .then(results => res.render('books/detail', {
      book: results[0],
      loans: results[1],
      booksPage: true 
    }))
    .catch(next)
})

router.post('/new', (req, res, next) => {
  Book
    .create(req.body)
    .then(() => res.redirect('/books/page/1'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render('books/new', {
          inputs: req.body,
          booksPage: true,
          errors: err.errors
        });
      }
      next(err);
    })
})

router.post('/all', (req, res, next) => {
  const query = req.body.search_field;
  Book
    .findAll({
      where: {
        [Op.or]: [
          { 'title': { [Op.like]: '%' + query + '%' } },
          { 'author': { [Op.like]: '%' + query + '%' } },
          { 'genre': { [Op.like]: '%' + query + '%' } },
          { 'first_published': { [Op.like]: '%' + query + '%' } }
        ]
      }
    })
    .then(books => res.render('books/list', {
      books,
      booksPage: true,
      search: true,
      term: query
    }))
    .catch(next)
})

router.post('/:id', (req, res, next) => {
  Book
    .findById(req.params.id)
    .then(book => book.update(req.body))
    .then(() => res.redirect('/books/page/1'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render('books/detail', {
          book: state[0],
          loans: state[1],
          booksPage: true, 
          errors: err.errors,
          inputs: req.body
        })
      }
      next(err);
    })
})

module.exports = router;

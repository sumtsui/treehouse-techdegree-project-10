var express = require('express');
var router = express.Router();
const sequelize = require('../models').sequelize;
const Op = sequelize.Op;
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const myFunc = require('../js/myFunc');

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
      .then(loans => res.render('books/overdue', { loans, overdue: true, booksPage: true }));
  }
  else if (req.query.filter === 'checked_out') {
    Loan
      .findAll({
        where: { returned_on: { [Op.ne]: null } },
        include: { model: Book }
      })
      .then(loans => res.render('books/checked_out', { loans, checked_out: true, booksPage: true }));
  }
  else res.redirect('/books/all');
});

router.get('/all', function (req, res, next) {
  Book
    .findAll()
    .then(books => res.render('books/all', { books, all: true, booksPage: true }));
});

router.get('/new', function (req, res, next) {
  res.render('books/new', { booksPage: true });
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
    .then(results => {
      results[1] = myFunc.formatDate(results[1]);
      return results;
    })
    .then(results => res.render('books/detail', { book: results[0], loans: results[1], booksPage: true }))
    .catch(next)
})

router.post('/new', (req, res, next) => {
  Book
    .create(req.body)
    .then(() => res.redirect('/books/all'))
    .catch(next)
})

router.post('/:id', (req, res, next) => {
  Book
    .findById(req.params.id)
    .then(book => book.update(req.body))
    .then(() => res.redirect('/books/all'))
    .catch(next)
})

module.exports = router;

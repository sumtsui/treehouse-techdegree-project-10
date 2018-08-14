var express = require('express');
var router = express.Router();
const sequelize = require('../models').sequelize;
const Op = sequelize.Op;
const Loan = require('../models').Loan;
const Book = require('../models').Book;
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
        include: [{ model: Book }, { model: Patron }]
      })
      .then(myFunc.formatDate)
      .then(loans => res.render('loans/overdue', { loans, overdue: true, loansPage: true }))
      .catch(next)
  }
  else if (req.query.filter === 'checked_out') {
    Loan
      .findAll({
        where: { returned_on: { [Op.eq]: null } },
        include: [{ model: Book }, { model: Patron }]
      })
      .then(myFunc.formatDate)
      .then(loans => res.render('loans/checked_out', { loans, checked_out: true, loansPage: true }))
      .catch(next)
  }
  else res.redirect('/loans/all');
});

router.get('/all', function (req, res, next) {
  Loan
    .findAll({
      include: [{ model: Patron }, { model: Book }]
    })
    .then(myFunc.formatDate)
    .then(loans => res.render('loans/all', { loans, all: true, loansPage: true }))
    .catch(next)
});

router.get('/new', function (req, res, next) {
  Promise
    .all([
      Book.findAll(),
      Patron.findAll(),
    ])
    .then(results => res.render('loans/new', { books: results[0], patrons: results[1], loansPage: true }))
    .catch(next)
});

router.post('/new', function (req, res, next) {
  Loan
    .create(req.body)
    .then(() => res.redirect('/loans/all'))
    .catch(next)
});

router.get('/return/:id', function (req, res, next) {
  Loan
    .findOne({
      where: { id: { [Op.eq]: req.params.id } },
      include: [{ model: Book }, { model: Patron }]
    })
    .then(myFunc.formatDate)
    .then(loan => res.render('loans/return', { loan, loansPage: true } ))
    .catch(next)
});

router.post('/return/:id', function (req, res, next) {
  Loan
    .findById(req.params.id)
    .then(loan => loan.update(req.body))
    .then(() => res.redirect('/loans/all'))
    .catch(next)
});

module.exports = router;

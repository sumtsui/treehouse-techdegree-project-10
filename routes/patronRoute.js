var express = require('express');
var router = express.Router();
const Patron = require('../models').Patron;
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const sequelize = require('../models').sequelize;
const Op = sequelize.Op;  // Sequelize operator module
const myFunc = require('../js/myFunc');

router.get('/', function(req, res, next) {
  res.redirect('/patrons/all');
});

router.get('/all', function (req, res, next) {
  Patron
    .findAll()
    .then(patrons => res.render('patrons/all', { patrons, patronsPage: true }));
});

router.get('/new', function (req, res, next) {
  res.render('patrons/new', { patronsPage: true });
});

router.get('/:id', function (req, res, next) {
  Promise
    .all([
      Patron.findById(req.params.id),
      Loan.findAll({
        where: { patron_id: { [Op.eq]: req.params.id } },
        include: { model: Book }
      })
    ])
    .then(results => [results[0], myFunc.formatDate(results[1])])
    .then(results => res.render('patrons/detail', { patron: results[0], loans: results[1], patronsPage: true }));
});

router.post('/new', function (req, res, next) {
  Patron
    .create(req.body)
    .then(() => res.redirect('/patrons/all'))
    .catch(next)
});

router.post('/:id', function (req, res, next) {
  Patron
    .findById(req.params.id)
    .then(patron => patron.update(req.body))
    .then(() => res.redirect('/patrons/all'))
    .catch(next)
});

module.exports = router;

var express = require('express');
var router = express.Router();
const Patron = require('../models').Patron;
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const sequelize = require('../models').sequelize;
const Op = sequelize.Op;
const myFunc = require('../js/myFunc');

let state;

router.get('/', function(req, res, next) {
  res.redirect('/patrons/page/1');
});

// router.get('/all', function (req, res, next) {
//   Patron
//     .findAll()
//     .then(patrons => res.render('patrons/list', {
//       patrons,
//       patronsPage: true
//     }))
//     .catch(next)
// });

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
    .then(results => {
      return (results[0] === null) ?
        next(new Error('Page not found :/'))
        :
        results;
    })
    .then(results => [
      results[0],
      myFunc.formatDate(results[1])
    ])
    .then(results => state = results)
    .then(results => res.render('patrons/detail', {
      patron: results[0],
      loans: results[1],
      patronsPage: true
    }))
    .catch(next)
});

/* --- Pagination route --- */
router.get('/page/:id', function (req, res, next) {
  const perPage = 10;
  Promise
    .all([
      Patron.findAll({
        offset: perPage * (req.params.id - 1),
        limit: perPage,
        order: [['id', 'DESC']]
      }),
      Patron.findAndCountAll(),
    ])
    .then(myFunc.log)
    .then(r => {
      return (r[0].length === 0) ?
        next(new Error('Page not found :/'))
        :
        r;
    })
    .then(r => res.render('patrons/list', {
      patrons: r[0],
      totalItems: r[1].count,
      all: true,
      patronsPage: true,
      perPage,
      currentPageId: req.params.id
    }))
    .catch(next)
});

router.post('/new', function (req, res, next) {
  Patron
    .create(req.body)
    .then(() => res.redirect('/patrons/page/1'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render('patrons/new', {
          inputs: req.body,
          patronsPage: true,
          errors: err.errors
        });
      }
      next(err);
    })
});

router.post('/all', (req, res, next) => {
  const query = req.body.search_field;
  Patron
    .findAll({
      where: {
        [Op.or]: [
          { 'first_name': { [Op.like]: '%' + query + '%' } },
          { 'last_name': { [Op.like]: '%' + query + '%' } },
          { 'library_id': { [Op.like]: '%' + query + '%' } },
          { 'email': { [Op.like]: '%' + query + '%' } }
        ]
      }
    })
    .then(patrons => res.render('patrons/list', {
      patrons,
      patronsPage: true,
      search: true,
      term: query
    }))
    .catch(next)
})

router.post('/:id', function (req, res, next) {
  Patron
    .findById(req.params.id)
    .then(patron => patron.update(req.body))
    .then(() => res.redirect('/patrons/page/1'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render('patrons/detail', {
          inputs: req.body,
          patron: state[0],
          loans: state[1],
          patronsPage: true,
          errors: err.errors
        })
      }
      next(err);
    })
});

module.exports = router;

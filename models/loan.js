'use strict';

module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: { msg: "Book ID is required" } }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: { msg: "Patron ID is required" } }
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: { msg: "Please enter loaned-on date" },
        isDate: { msg: "Please enter a vaild loaned_on date" },
        // isAfter: {
        //   args: `${new Date((new Date()).getTime() - (1 * 86400000)).toJSON().slice(0, 10)}`,
        //   msg: 'Loaned-on date can not be eariler than today'
        // }
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: { 
        notEmpty: { msg: "Please enter return-by date" },
        isDate: { msg: "Please enter a vaild return-by date" },
        // isAfter: {
        //   args: `${new Date().toJSON().slice(0, 10)}`,
        //   msg: 'Return-by date can not be eariler than today'
        // }
      }
    },
    returned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: { msg: "Returned-on date is required" },
        isDate: { msg: "Returned-on date is not vaild" },
        isAfter: {
          args: `${new Date((new Date()).getTime() - (1 * 86400000)).toJSON().slice(0, 10)}`,
          msg: 'Returned-on date can not be eariler than today'
        }
      }
    },
  }, {
    timestamps: false,
    underscored: true,
  });

  Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Patron);
    Loan.belongsTo(models.Book);
  };

  return Loan;
};
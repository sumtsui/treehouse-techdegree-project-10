'use strict';

module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
    },
    patron_id: {
      type: DataTypes.INTEGER,
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: { notEmpty: { msg: "Loaned-on date is required" } }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: { notEmpty: { msg: "Return-by date is required" } }
    },
    returned_on: {
      type: DataTypes.DATE,
      validate: { notEmpty: { msg: "Returned-on date is required" } }
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
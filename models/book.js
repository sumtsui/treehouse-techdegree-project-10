'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter title" } }
    },
    author: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter author" } }
    },
    genre: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter genre" } }
    },
    first_published: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
    underscored: true
  });
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};
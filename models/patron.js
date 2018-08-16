'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    first_name: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter first name" } }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter last name" } }
    },
    address: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter address" } }
    },
    email: {
      type: DataTypes.STRING,
      validate: { 
        notEmpty: { msg: "Please enter email" },
        isEmail: { msg: "Please enter a vaild email address" }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter library ID" } }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: { msg: "Please enter zipcode" } }
    }
  }, {
    timestamps: false,
    underscored: true
  });
  Patron.associate = function(models) {
    // associations can be defined here
  };
  return Patron;
};
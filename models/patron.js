'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    first_name: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "First name is required" } }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Last name is required" } }
    },
    address: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Address is required" } }
    },
    email: {
      type: DataTypes.STRING,
      validate: { 
        notEmpty: { msg: "Email is required" },
        isEmail: { msg: "Please enter a vaild email address" }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Library ID is required" } }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: { msg: "Zipcode is required" } }
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
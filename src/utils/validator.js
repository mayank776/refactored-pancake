const mongoose = require('mongoose');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const phoneRegex = /^[6-9][0-9]{9}$/;

const validatePhone = function (phone) {
  return phoneRegex.test(phone);
};

const validateEmail = function (email) {
  return emailRegex.test(email);
};

const isValid = function (value) {
  if (typeof value === "object" && value.length === 0) return false;
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const validPassword = function (password) {
  return password.length >= 8;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidString = function (value) {
  return Object.prototype.toString.call(value) === "[object String]";
};

const isArray = function (arr) {
  return Array.isArray(arr);
};

const isValidRating = function (rating) {
  return rating > 0 && rating < 11;
};

module.exports = {
  validateEmail,
  validatePhone,
  emailRegex: emailRegex,
  phoneRegex: phoneRegex,
  isValid,
  isValidRequestBody,
  validPassword,
  isValidObjectId,
  isValidString,
  isArray,
  isValidRating
};

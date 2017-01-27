var util = require('util');

// Custom error class to distinguish errors returned from Dynamics API
function DynamicsError(message, details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.details = details;
  console.log('DYNAMICS ERROR');
  console.log('MESSAGE', this.message);
  console.log('DETAILS', this.details);
};

util.inherits(DynamicsError, Error);

module.exports = DynamicsError;
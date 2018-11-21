'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.createToken = function(user){
  var payload = {

      sub: user._id,
      name: user.surname,
      email: user.email,
      role: user.role,
      image: user.image,
      iat: moment().unix(),
      exp: moment().add(30, 'day').unix

  };

  return jwt.encode(payload, secret);
};
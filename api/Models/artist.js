'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = Schema({
  name: String,
  description: String,
  image: String

});

//exportar modelo para instanciar el usuario
module.exports = mongoose.model('Artist', ArtistSchema);

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
  name: String,
  description: String,
  year: Number,
  image: String,
  artist: {type: Schema.ObjectId, ref: 'Artist'} //Guarda el id de otra tabla de la db

});

//exportar modelo para instanciar el usuario
module.exports = mongoose.model('Album', AlbumSchema);

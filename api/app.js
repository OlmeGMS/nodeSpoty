// cargar express

'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./Routes/user');
var artist_routes = require('./Routes/artist');
var album_routes = require('./Routes/album');
var song_routes = require('./Routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras http

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Se permite el acceso a todos los dominios
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'); //cabecera ajax
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); // metodos http
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});

// carga de rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);


module.exports = app;

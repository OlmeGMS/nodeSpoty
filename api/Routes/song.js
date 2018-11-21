'use strict'
//recuerde cargar la ruta en app.js
var express = require('express');
var SongController = require('../Controllers/song');
var api = express.Router();
var md_auth = require('../Middlewares/authenticated');

//subir ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './Uploads/songs'}); // ruta donde se guardan las imagenes


api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);


module.exports = api;

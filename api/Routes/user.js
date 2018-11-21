'use strict'

var express = require('express');
var UserController = require('../Controllers/user');

var api = express.Router();
var md_auth = require('../Middlewares/authenticated');

//subir ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart ({ uploadDir: './Uploads/users'}); // ruta donde se guardan las imagenes


//md_auth.ensureAuth valida la autenticación
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
//ruta para subir imagenes
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
//obtener la imgen del usurio
api.get('/get-image-user/:imageFile',  UserController.getImageFile);


module.exports = api;

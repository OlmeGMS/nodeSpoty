'use strict'

var path = require('path');
var fs = require('fs');
//Modulos de paginación
var mongoosPaginate = require('mongoose-pagination');

//cargar el modelo de arstista
var Artist = require('../Models/artist');
var Album = require('../Models/album');
var Song = require('../Models/song');


function getAlbum(req, res) {

  //res.status(200).send({message: 'Accion getAlbum'});

  var albumId = req.params.id; // se captura el id del album

  //se captura todos los datos  del artista en que esta en el id de album
  Album.findById(albumId).populate({
    path: 'artist'
  }).exec((err, album) => {
    if (err) {
      res.status(500).send({
        message: 'Error en la petición'
      });

    } else {
      if (!album) {
        res.status(404).send({
          message: 'El album no existe'
        });
      } else {
        res.status(200).send({
          album
        });
      }

    }

  });


}


function getAlbums(req, res) {
  var artistId = req.params.artist;

  if (!artistId) {
    //Sacar todos los albums de la bd
    var find = Album.find({}).sort('name');
  } else {
    // Sacar los albumns de un artistas concreto de ls bd
    var find = Album.find({
      artist: artistId
    }).sort('year');

  }

  find.populate({
    path: 'artist'
  }).exec((err, albums) => {
    if (err) {
      res.status(500).send({
        message: 'ERRO: No se pudo hacer la petición'
      });
    } else {
      if (!albums) {
        res.status(404).send({
          message: 'ERROR: No hay albums'
        });

      } else {
        res.status(200).send({
          albums
        });
      }
    }
  });
}

function saveAlbum(req, res) {
  var album = new Album();

  var params = req.body;
  album.name = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({
        message: 'Erro en el servidor'
      });
    } else {
      if (!albumStored) {
        res.status(400).send({
          message: 'No se ha guardado'
        });
      } else {
        res.status(200).send({
          album: albumStored
        });
      }
    }
  });

}

function updateAlbum(req, res) {
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({
        message: 'ERROR: No se puedo realizar la peteición'
      });
    } else {
      if (!albumUpdated) {
        res.status(404).send({
          message: 'ERROR: No se puedo actualizar el album'
        });
      } else {
        res.status(200).send({
          album: albumUpdated
        });
      }
    }
  });
}

function deleteAlbum(req, res) {
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {

    if (err) {
      res.status(500).send({
        message: 'Error al eliminar el album'
      });
    } else {
      if (!albumRemoved) {
        res.status(404).send({
          message: 'EL Album no ha sido elimindado'
        });
      } else {
        Song.find({
          album: albumRemoved._id
        }).remove((err, songRemoved) => {

          if (err) {
            res.status(500).send({
              message: 'Error al eliminar la cancion'
            });
          } else {
            if (!songRemoved) {
              res.status(404).send({
                message: 'La cancion no ha sido elimindada'
              });
            } else {
              res.status(200).send({
                album: albumRemoved
              });
            }
          }

        });
      }
    }

  });
}

function uploadImage(req, res) {
  var albumId = req.params.id;
  var file_name = 'No subido...';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\/');
    var file_name = file_split[2];

    // recoger la extencion
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1]; // divide el nombre y la extension del archivo

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

      // actualizar la imagen del usuarios
      Album.findByIdAndUpdate(albumId, {
        image: file_name
      }, (err, albumUpdated) => {

        if (!albumId) {
          res.status(404).send({
            message: 'No se ha podido actualizar el ususario'
          });
        } else {
          res.status(200).send({
            album: albumUpdated
          });
        }


      });

    } else {
      res.status(200).send({
        message: 'La extensión del archivo no es valida'
      });
    }

    //console.log(file_path);

  } else {
    res.status(200).send({
      message: 'No se ha subido ninguna imagen'
    });

  }
}

function getImageFile(req, res) {

  var imageFile = req.params.imageFile;
  var path_file = './Uploads/albums/' + imageFile;

  fs.exists(path_file, function(exists) {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({
        message: 'No exite la imgen'
      });
    }
  });


}



module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};

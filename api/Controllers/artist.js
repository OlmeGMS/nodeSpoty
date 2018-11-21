'use strict'

var path = require('path');
var fs = require('fs');
//Modulos de paginación
var mongoosPaginate = require('mongoose-pagination');

//cargar el modelo de arstista
var Artist = require('../Models/artist');
var Album = require('../Models/album');
var Song = require('../Models/song');


function getArtist(req, res){

  //recoger el id del artista por url
  var artistId = req.params.id;

  //buscar el artista por ID
  Artist.findById(artistId, (err, artist) =>{
    if(err){
        res.status(500).send({message: 'Error en la petición'});
    }else{
        if(!artist){
          res.status(404).send({message: 'El artista no existe'});
        }else{
          res.status(200).send({artist});
        }
    }

  });

}

//listar Artisitas

function getArtists(req, res){


  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  }
  var itemsPerPage = 4;

  Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!artists){
        res.status(404).send({message: 'No hay Artisitas'});
      }else{
        return res.status(200).send({
          total_items: total,
          artists: artists
        });

      }
    }

  });
}

function saveArtist(req, res){
  // crear objeto del arstista
  var artist = new Artist();

  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';
  //funcion callback que llama el error o el artista guardado
  artist.save((err, artistStored) => {
     if(err){
       res.status(500).send({message: 'ERROR: No se pudo guardar el artisita'});

     }else{
       if(!artistStored){
         res.status(404).send({message: 'EL artista no ha sido guardado'});
       }else{
         res.status(200).send({artist: artistStored});
       }
     }
  });



}

function updateArtist(req, res){

  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if(err){
      res.status(500).send({message: 'ERROR: en la petición'});
    }else{
      if(!artistUpdated){
          res.status(404).send({message: 'EL artista no ha sido actualizado'});
      }else{
          res.status(200).send({artist: artistUpdated});
      }
    }
  });

}

function deleteArtist(req, res){
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!artistRemoved){
        res.status(404).send({message: 'El artista no ha sido elimindado'});
      }else{


        //Borra todos los Album que esta relacionado con el artista lo busca por id
        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {

          if(err){
            res.status(500).send({message: 'Error al eliminar el album'});
          }else{
            if(!albumRemoved){
              res.status(404).send({message: 'EL Album no ha sido elimindado'});
            }else{
              Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {

                if(err){
                  res.status(500).send({message: 'Error al eliminar la cancion'});
                }else{
                  if(!songRemoved){
                    res.status(404).send({message: 'La cancion no ha sido elimindada'});
                  }else{
                      res.status(200).send({artist: artistRemoved});
                  }
                }

              });
            }
          }

        });
      }
    }
  });
}

function uploadImage(req, res){
var artistId = req.params.id;
var file_name = 'No subido...';

if(req.files){
  var file_path = req.files.image.path;
  var file_split = file_path.split('\/');
  var file_name = file_split[2];

  // recoger la extencion
  var ext_split = file_name.split('\.');
  var file_ext = ext_split[1]; // divide el nombre y la extension del archivo

  if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

  // actualizar la imagen del usuarios
  Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {

    if(!artistId){
      res.status(404).send({message: 'No se ha podido actualizar el ususario'});
    }else{
      res.status(200).send({artist: artistUpdated});
    }


  });

  }else{
    res.status(200).send({message: 'La extensión del archivo no es valida'});
  }

  //console.log(file_path);

}else{
  res.status(200).send({message: 'No se ha subido ninguna imagen'});

}
}

function getImageFile(req, res){

var imageFile = req.params.imageFile;
var path_file = './Uploads/artists/'+imageFile;

fs.exists(path_file, function(exists){
  if(exists){
    res.sendFile(path.resolve(path_file));
  }else{
    res.status(200).send({message: 'No exite la imgen'});
  }
});


}


module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile

}

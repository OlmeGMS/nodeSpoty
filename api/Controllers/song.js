'use strict'

var path = require('path');
var fs = require('fs');
//Modulos de paginación
var mongoosPaginate = require('mongoose-pagination');

//cargar el modelo de arstista
var Artist = require('../Models/artist');
var Album = require('../Models/album');
var Song = require('../Models/song');

function getSong(req, res){
  var songId = req.params.id;

  Song.findById(songId).populate({path: 'album'}).exec((err, song) => {

    if(err){
      res.status(500).send({message: 'ERROR: No se pudo realizar la petición'});
    }else{
      if(!song){
        res.status(404).send({message: 'ERROR: La cancion no existe'});
      }else{
        res.status(200).send({song});
      }
    }
  });


  //res.status(200).send({message: 'Controlador de cancion'});

}

function getSongs(req, res){
  var albumId = req.params.album;

  if(!albumId){
    var find = Song.find({}).sort('number');
  }else{
      var find = Song.find({album: albumId}).sort('number');

  }

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec(function(err, songs){
    if(err){
      res.status(500).send({message: 'ERROR: No se pudo realizar la petición'});
    }else{
      if(!songs){
        res.status(404).send({message: 'ERROR: No extite canciones'});
      }else{
        res.status(200).send({songs});
      }
    }
  });

}

function saveSong(req, res){
  var song = new Song();

  var params = req.body;
  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = null;
  song.album = params.album;


  song.save((err, songStored) => {
    if(err){
      res.status(500).send({message: 'ERROR: No se puedo realizar la petición'});
    }else{
      if(!songStored){
        res.status(404).send({message: 'ERROR: No se puedo guardar la cancion'});
      }else{
        res.status(200).send({song: songStored});
      }
    }
  });
}


function updateSong(req, res){
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId, update, (err, songUpdate) => {
    if(err){
      res.status(500).send({message: 'ERROR: No se puedo realizar la petición'});
    }else{
      if(!songUpdate){
        res.status(404).send({message: 'ERROR: No se puedo actualizar la cancion'});
      }else{
        res.status(200).send({song: songUpdate});
      }
    }

  });
}

function deleteSong(req, res){
  var songId = req.params.id;

  Song.findByIdAndRemove(songId, (err, songRemoved) => {
    if(err){
      res.status(500).send({message: 'ERROR: No se puedo realizar la petición'});
    }else{
      if(!songRemoved){
        res.status(404).send({message: 'ERROR: No se puedo eliminar la cancion'});
      }else{
        res.status(200).send({song: songRemoved});
      }
    }
  });
}

function uploadFile(req, res){
var songId = req.params.id;
var file_name = 'No subido...';

if(req.files){
  var file_path = req.files.file.path;
  var file_split = file_path.split('\/');
  var file_name = file_split[2];

  // recoger la extencion
  var ext_split = file_name.split('\.');
  var file_ext = ext_split[1]; // divide el nombre y la extension del archivo

  if (file_ext == 'mp3' || file_ext == 'ogg' || file_ext == 'wav'){

  // actualizar la imagen del usuarios
  Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {

    if(!songUpdated){
      res.status(404).send({message: 'No se ha podido actualizar la cancion'});
    }else{
      res.status(200).send({song: songUpdated});
    }


  });

  }else{
    res.status(200).send({message: 'La extensión del archivo no es valida'});
  }

  //console.log(file_path);

}else{
  res.status(200).send({message: 'No se ha subido el fichero de audio'});

}
}

function getSongFile(req, res){

var imageFile = req.params.songFile;
var path_file = './Uploads/songs/'+imageFile;

fs.exists(path_file, function(exists){
  if(exists){
    res.sendFile(path.resolve(path_file));
  }else{
    res.status(200).send({message: 'No exite el fichero de audio'});
  }
});


}

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
}

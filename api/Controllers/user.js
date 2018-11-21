'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../Models/user');
var jwt = require('../Services/jwt.js');



function pruebas(req, res){
  res.status(200).send({
    message: 'Probando una acción del controlador de usuarios del api rest con NodeJS y MongoDB'
  });
}


function saveUser(req,res){
  var user = new User();

  var params = req.body;

  console.log(params);

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_USER';
  user.image = 'null';


  if(params.password){
    // Encriptar contraseña y guardar datos
    bcrypt.hash(params.password, null, null, function(err, hash){
      user.password = hash;

      if(user.name != null && user.surname != null && user.email != null){
        // guarde el usuario
        user.save((err, userStored) => {
          if(err){
            res.status(500).send({message: 'ERROR al guardar usuario'});
          }else{
            //verificar si se guardo correctametnete el ususario
            if(!userStored){
              res.status(404).send({message: 'No se a registrado el ususario'});
            }else{
              res.status(200).send({user: userStored});
            }
          }
        });

      }else{
        res.status(200).send({message: 'Digite todos los campos'});
      }

    });

  }else{
    res.status(200).send({message: 'Introduce la contraseña'});
  }

}


function loginUser(req, res){

var params = req.body;

var email = params.email;
var password = params.password;

// se busca el email es como un where en mysql
User.findOne({email: email.toLowerCase() }, (err, user) => {
  if(err){
    res.status(500).send({message: 'Error en la petición'});
  }else{
      if(!user){
          res.status(404).send({message: 'El ususario no existe'});
      }else{
          //Comprobar la contraseña
          bcrypt.compare(password, user.password, function(err, check){
            if(check){
                //Devolver  los datos del usurio logeado
                if(params.gethash){
                  // devolver un token de jwt
                  res.status(200).send({
                    token: jwt.createToken(user)
                  });
                }else{
                  res.status(200).send({user});
                }
            }else{
              res.status(404).send({message: 'El ususario no a podido logearse'});
            }

          });
      }
  }

});

}


// Actualizar usuarios
function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body; //recojemos los todos los datos del ususario

  if(userId != req.user.sub){
    return res.status(500).send({message: 'Error: No tienes permisos para actualizar este ususario'});
  }

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if(err){
      res.status(500).send({message: 'Error al actualizar el ususario'});
    }else{
      if(!userUpdated){
        res.status(404).send({message: 'No se ha podido actualizar el ususario'});
      }else{
        res.status(200).send({user: userUpdated});
      }
    }

  });

}

// controlador para subir imagenes del usuarios
  function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){

    var file_path = req.files.image.path;
    //console.log(file_path);
    var file_split = file_path.split('\/');
    var file_name = file_split[2];


    // recoger la extencion
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1]; // divide el nombre y la extension del archivo

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

    // actualizar la imagen del usuarios
    User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {

      if(!userUpdated){
        res.status(404).send({message: 'No se ha podido actualizar el ususario'});
      }else{
        res.status(200).send({image: file_name, user: userUpdated}); // image recibe el nombre del fichero
      }


    });

    }else{
      res.status(200).send({message: 'La extensión del archivo no es valida'});
    }



  }else{
    res.status(200).send({message: 'No se ha subido ninguna imagen'});

  }
}

function getImageFile(req, res){

  var imageFile = req.params.imageFile;
  var path_file = './Uploads/users/'+imageFile;

  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No exite la imgen'});
    }
  });


}




// se devuelde en un metodo Json
module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};

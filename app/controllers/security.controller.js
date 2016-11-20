'use strict';
const Model = require('./../models/user.model');
const CustomError = require('./../utils/custom-error');
const mongoose = require('mongoose');
const backup = require('mongodb-backup');
const restore = require('mongodb-restore');

const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

const mongoConfig = require('./../config/internalConfigs').mongo;
const mongoUrl = mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.dbName;

module.exports.restartUserPwd = (req, res, next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new CustomError('Invalid Id',400));
  }
  const data = {password: ''};

  Model.updatePwd(req.params.id, data, false, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
};

module.exports.updateUserPwd = (req, res, next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new CustomError('Invalid Id',400));
  }
  const data = {password: req.body.password};
  if(req.body.isChanging){
    Model.getById(req.params.id, (err, object)=>{
      if(err){return next(err);}
      if(req.body.oldPassword != object.oldPassword){return next(new CustomError('Invalid old password', 400));}

        Model.updatePwd(req.params.id, data, true, (err, object)=>{
          if(err){return next(err);}

          res.status(200).json(object);
        })
    })
  }else{
    Model.updatePwd(req.params.id, data, true, (err, object)=>{
      if(err){return next(err);}

      res.status(200).json(object);
    })
  }


};

module.exports.backupDb = (req, res, next) => {
  backup({
      uri: mongoUrl, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
      collections: [ 'catalogs', 'materials', 'typematerials', 'users' ],
      parser: 'json',
      root: __dirname + '/projectsControl',
      stream: res, // send stream into client response
  });
};

module.exports.restoreDb = (req, res, next) => {
  //   restore({
  //   uri: mongoUrl, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
  //   dropCollections: [ 'catalogs', 'materials', 'typematerials', 'users' ],
  //   // root: __dirname + '/projectsControl'
  //   stream: stream,
  //   callback: (err)=>{
  //     if(err){return next(err);}
  //
  //     res.status(200);
  //   }
  // });

  var busboy = new Busboy({ headers: req.headers });
    var este = {};
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      file.on('data', function(data) {
          console.log('File [' + mongoUrl + ']');
          console.log('TEST => ',data);

          // var stream = fs.createReadStream(file); // simulate filesystem stream
          // este = fs.createReadStream(file); // simulate filesystem stream
          este = file;
        //   restore({
        //   uri: mongoUrl, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
        //   root: __dirname + '/projectsControl',
        //   stream: data,
        //   callback: function(err){
        //     if(err){return next(err);}
        //     console.log('PASOOO');
        //     res.writeHead(200, { 'Connection': 'close' });
        //     res.end("Restored");
        //   }
        // });
          console.log(1);
      });
      console.log('Head2');
    });
    busboy.on('finish', function() {
        restore({
            uri: mongoUrl, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
            root: __dirname + '/projectsControl'
        });
      res.writeHead(200, { 'Connection': 'close' });
      res.end("Restored");

    });
    return req.pipe(busboy);
};

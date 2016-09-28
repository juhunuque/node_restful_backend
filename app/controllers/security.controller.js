'use strict';
const Model = require('./../models/user.model');
const CustomError = require('./../utils/custom-error');
const mongoose = require('mongoose');
const backup = require('mongodb-backup');

const mongoConfig = require('./../config/internalConfigs').mongo;
const mongoUrl = mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.dbName;

module.exports.restartUserPwd = (req, res, next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new CustomError('Invalid Id1',400));
  }
  const data = {password: ''};

  Model.updatePwd(req.params.id, data, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
};

module.exports.updateUserPwd = (req, res, next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new CustomError('Invalid Id2',400));
  }
  const data = {password: req.body.password};

  Model.updatePwd(req.params.id, data, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
};

module.exports.backupDb = (req, res, next) => {
  backup({
      uri: mongoUrl, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
      collections: [ 'catalogs', 'materials', 'typematerials', 'users' ],
      parser: 'json',
      stream: res, // send stream into client response
  });
};

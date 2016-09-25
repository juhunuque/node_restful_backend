'use strict';
const Model = require('./../models/user.model');
const CustomError = require('./../utils/custom-error');
const mongoose = require('mongoose');

// Get All
module.exports.getAll = (req, res, next) => {
  Model.getAll((err, objects)=>{
    if(err){return next(err);}
    if(!objects){return next(new CustomError('No data found',400));}

    res.status(200).json(objects);
  });
};

// Get single object by id
module.exports.getOneById = (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new CustomError('Invalid Id',400));
  }
  Model.getById(req.params.id,(err, object)=>{
    if(err){return next(err);}
    if(!object){return next(new CustomError('No data found', 400));}

    res.status(200).json(object);
  });
};

// Create new object
module.exports.createObject = (req, res, next) => {
  const newObject = new Model({
    username: req.body.username,
    roles: req.body.roles,
    name: req.body.name,
    lastname: req.body.lastname,
    active: req.body.active
  });

  Model.createObject(newObject, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  });
};

// Remove object
module.exports.removeObject = (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new CustomError('Invalid Id',400));
  }
  Model.removeObject(req.params.id, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
};

// Update object
module.exports.updateObject = (req, res, next) => {
  const data = {
    username: req.body.username,
    roles: req.body.roles,
    name: req.body.name,
    lastname: req.body.lastname,
    active: req.body.active
  };

  Model.updateObject(req.params.id, data, (err, object)=>{
    if(err){return next(err);}
    if(!object){return next(new CustomError('User invalid!', 400));}

    res.status(200).json(object);
  })
};

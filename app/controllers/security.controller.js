'use strict';
const Model = require('./../models/user.model');
const CustomError = require('./../utils/custom-error');
const mongoose = require('mongoose');

module.exports.restartUserPwd = (req, res, next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new CustomError('Invalid Id',400));
  }
  const data = {password: ''};

  Model.updatePwd(req.params.id, data, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
}

module.exports.updateUserPwd = (req, res, next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new CustomError('Invalid Id',400));
  }
  const data = {password: req.body.password};

  Model.updatePwd(req.params.id, data, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
}

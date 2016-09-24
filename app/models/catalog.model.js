'use strict';
const mongoose = require('mongoose');

const typeMaterialSchema = mongoose.Schema({
  type:{
    type: String,
    default: ''
  },
  description:{
    type: String,
    default:''
  }
});

const TypeMaterial = module.exports = mongoose.model('TypeMaterial', typeMaterialSchema);

//Get All
module.exports.getAll = (callback) => {
  TypeMaterial.find(callback).sort({_id: -1});
};

//Get by ID
module.exports.getById = (id, callback) => {
  TypeMaterial.findById(id, callback);
};

//Add Object
module.exports.createObject = (newObject, callback) => {
  newObject.save(callback);
};

//Remove Object
module.exports.removeObject = (id, callback) => {
  TypeMaterial.find({_id: id}).remove(callback);
};

//Update Object
module.exports.updateObject = (id, data, callback) => {
  TypeMaterial.findById(id, (err, obj) => {
    if(!obj){
      return next(new Error("Could not load TypeMaterial to update"))
    }else{
      obj.type = data.type;
      obj.description = data.description;

      obj.save(callback);
    }
  });
};

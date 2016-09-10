'use strict';
const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  project:{
    type: String,
    required: true
  },
  description:{
    type: String,
    default: ''
  },
  createdDt:{
    type: Date,
    default: ''
  },
  createdBy:{
    type: String,
    default: ''
  },
  material:{
    type: String,
    default: ''
  },
  status:{
    type: String,
    default: ''
  }
});

const Project = module.exports = mongoose.model('Project', projectSchema);

//Get All
module.exports.getAll = (callback) => {
  Project.find(callback).sort({_id: -1});
};

//Get by ID
module.exports.getById = (id, callback) => {
  Project.findById(id, callback);
};

//Add Object
module.exports.createObject = (newObject, callback) => {
  newObject.save(callback);
};

//Remove Object
module.exports.removeObject = (id, callback) => {
  Project.find({_id: id}).remove(callback);
};

//Update Object
module.exports.updateObject = (id, data, callback) => {
  Project.findById(id, (err, obj) => {
    if(!obj){
      return next(new Error("Could not load Catalog to update"))
    }else{
      obj.project = data.project;
      obj.description = data.description;
      obj.createdDt = data.createdDt;
      obj.createdBy = data.createdBy;
      obj.material = data.material;
      obj.status = data.status;

      obj.save(callback);
    }
  });
};

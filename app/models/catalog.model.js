'use strict';
const mongoose = require('mongoose');

const catalogSchema = mongoose.Schema({
  nameCatalog:{
    type: String,
    default: ""
  },
  dataCatalog:{
    type: String,
  }
});

const Catalog = module.exports = mongoose.model('Catalog', catalogSchema);

//Get All
module.exports.getAll = (callback) => {
  Catalog.find(callback).sort({_id: -1});
};

//Get by ID
module.exports.getById = (id, callback) => {
  Catalog.findById(id, callback);
};

//Add Object
module.exports.createObject = (newObject, callback) => {
  newObject.save(callback);
};

//Remove Object
module.exports.removeObject = (id, callback) => {
  Catalog.find({_id: id}).remove(callback);
};

//Update Object
module.exports.updateObject = (id, data, callback) => {
  Catalog.findById(id, (err, obj) => {
    if(!obj){
      return next(new Error("Could not load Catalog to update"))
    }else{
      obj.nameCatalog = data.nameCatalog;
      obj.dataCatalog = data.dataCatalog;

      obj.save(callback);
    }
  });
};

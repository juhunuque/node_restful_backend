'use strict';
const mongoose = require('mongoose');

const materialSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  description:{
    type: String,
    default: ''
  },
  category:{
    type: String,
    default: ''
  },
  quantity:{
    type: Number,
    default: 0
  },
  measure:{
    type: String,
    default: ''
  },
  holdQty:{
    type: Number,
    default: 0
  }
});

const Material = module.exports = mongoose.model('Material', materialSchema);

//Get All
module.exports.getAll = (callback) => {
  Material.find(callback).sort({_id: -1});
};

//Get by ID
module.exports.getById = (id, callback) => {
  Material.findById(id, callback);
};

//Add Object
module.exports.createObject = (newObject, callback) => {
  newObject.save(callback);
};

//Remove Object
module.exports.removeObject = (id, callback) => {
  Material.find({_id: id}).remove(callback);
};

//Update Object
module.exports.updateObject = (id, data, callback) => {
  Material.findById(id, (err, obj) => {
    if(!obj){
      return next(new Error("Could not load Catalog to update"))
    }else{
      obj.name = data.name;
      obj.description = data.description;
      obj.category = data.category;
      obj.quantity = data.quantity;
      obj.measure = data.measure;
      obj.holdQty = data.holdQty;

      obj.save(callback);
    }
  });
};

//Update Object
module.exports.updateHoldQuantity = (id, data, callback) => {
  Material.findById(id, (err, obj) => {
    if(!obj){
      return next(new Error("Could not load Catalog to update"))
    }else{
      obj.holdQty = obj.holdQty + data.holdQty;

      obj.save(callback);
    }
  });
};

module.exports.updateQuantity = (id, data, callback) => {
  Material.findById(id, (err, obj) => {
    if(!obj){
      return next(new Error("Could not load Catalog to update"))
    }else{
      obj.quantity = obj.quantity - data.qty < 0 ? 0 : obj.quantity - data.qty;

      obj.save(callback);
    }
  });
};

module.exports.fillReport = (data, callback) => {
  if(!data.category || data.category == 'undefined'){
    Material.find(callback).sort({_id: -1});
  }else{
    Material.find({'category': data.category}, callback).sort({_id: -1});
  }
}

module.exports.fillReportReStock = (data, callback) => {
  Material.find({quantity: parseInt(data.quantity)}, callback).sort({_id: -1});
}

'use strict';
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    default: ''
  },
  createdDt:{
    type: Date,
    default: Date.now
  },
  roles:{
    type: Array,
    default: []
  },
  name:{
    type: String,
    default: ''
  },
  lastname:{
    type: String,
    default: ''
  },
  active:{
    type: Boolean,
    default: true
  }
});

const User = module.exports = mongoose.model('User', userSchema);

//Get All
module.exports.getAll = (callback) => {
  User.find(callback).sort({_id: -1});
};

//Get by ID
module.exports.getById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getByUser = function(user, callback){
  User.findOne({username: user, active: true}, callback);
};

//Add Object
module.exports.createObject = (newObject, callback) => {
  newObject.save(callback);
};

//Remove Object
module.exports.removeObject = (id, callback) => {
  User.find({_id: id}).remove(callback);
};

//Update Object
module.exports.updateObject = (id, data, callback) => {
  User.findById(id, (err, obj) => {
    if(!obj){
      return next(new Error("Could not load Catalog to update"))
    }else{
      obj.username = data.username;
      obj.roles = data.roles;
      obj.name = data.name;
      obj.lastname = data.lastname;
      obj.active = data.active;

      obj.save(callback);
    }
  });
};

//Restart password
module.exports.updatePwd = (id, data, callback) => {
  User.findById(id, (err, obj) => {
    if(!obj){
      return next(new Error("Could not load Catalog to update"))
    }else{
      obj.password = data.password;

      obj.save(callback);
    }
  });
};

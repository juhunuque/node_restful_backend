var User = require('./../models/user.model');

const newObject = new User({
  nombre: 'admin',
  apellidos: 'admin',
  username: 'admin',
  password: '12345',
  oldPassword: '12345',
  roles:['ADMINISTRADOR']
});

// Check if the user already exists
User.getByUser(newObject.username,(err, object)=>{
  if(!object){
    // If the user does not exist, create a new one
    User.createObject(newObject, (err, object)=>{
      console.log("Admin user created");
    });
  }
});

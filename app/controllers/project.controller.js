'use strict';
const Model = require('./../models/project.model');
const Material = require('./../models/material.model');
const CustomError = require('./../utils/custom-error');
const mongoose = require('mongoose');
const PdfPrinter = require('pdfmake/src/printer');
const moment = require('moment');

// 190.113.126.150
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
    project: req.body.project,
    description: req.body.description,
    createdBy: req.body.createdBy,
    material: req.body.material,
    quantity: req.body.quantity
  });

  Model.createObject(newObject, (err, object)=>{
    if(err){return next(err);}
    newObject.material.map((obj,index)=>{
      Material.updateHoldQuantity(obj.object._id, {
        holdQty: parseInt(obj.quantity)
      }, (err, object)=>{
        if(err){return next(err);}
      });
    });

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
    project: req.body.project,
    description: req.body.description,
    material: req.body.material,
    status: req.body.status,
    quantity: req.body.quantity
  };

  Model.updateObject(req.params.id, data, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
};

// Update status
module.exports.updateStatus = (req, res, next) => {
  const data = {
    status: req.body.status,
  };

  Model.updateStatus(req.params.id, data, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
};

module.exports.reportProject = (req, res, next)=>{
  let filename = 'projectReport';
  filename = encodeURIComponent(filename) + '.pdf';
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');

  const dateNow = moment().format('Do MMM YY, h:mm:ss a');

  var fonts = {
        Roboto: {
            normal: './fonts/Roboto-Regular.ttf',
            bold: './fonts/Roboto-Medium.ttf',
            italics: './fonts/Roboto-Regular.ttf',
            bolditalics: './fonts/Roboto-Regular.ttf',
        }
    };

    const printer = new PdfPrinter(fonts);

    Model.fillReport({fromDt: req.query.fromDt, toDt: req.query.toDt},(err, objects)=>{
      if(err){return next(err);}
      if(!objects){return next(new CustomError('No data found',400));}

      let objectsArray = new Array();
      objectsArray.push([{ text: 'Proyecto', style: 'tableHeader' },
         { text: '# piezas', style: 'tableHeader' },
         { text: 'Estado', style: 'tableHeader' },
         { text: 'Creado en', style: 'tableHeader' },
         { text: 'Creado por', style: 'tableHeader' }
       ]);

      objects.map((object, index)=>{
        objectsArray.push([
            object.project.toString(),
            object.quantity.toString(),
            object.status.toString(),
            moment(object.createdDt).format('Do MMM YY, h:mm:ss a'),
            object.createdBy.toString()
          ]);
      })


      const dd = {
        content:[
          { text: 'Entre Hilos & Agujas', style: 'subheader',  },
          { text: 'Reporte de proyectos', style: 'header', alignment: 'center' },
          { text: 'Generado ' + dateNow, style: 'subheader', color: '#666666', alignment: 'center' },
          { text: 'Generado por: ' + req.query.username, style: 'subheader', color: '#666666', alignment: 'center' },
          {
    						style: 'tableExample',
    						table: {
                    body: objectsArray
    						},
                layout: 'lightHorizontalLines'
    				}
        ],
        styles: {
      		header: {
      			fontSize: 18,
      			bold: true,
      			margin: [0, 0, 0, 10]
      		},
      		subheader: {
      			fontSize: 16,
      			bold: true,
      			margin: [0, 10, 0, 5]
      		},
      		tableExample: {
      			margin: [0, 5, 0, 15]
      		},
      		tableHeader: {
      			bold: true,
      			fontSize: 13,
      			color: 'black'
      		}
      	}
      }

      const pdfDoc = printer.createPdfKitDocument(dd);
      pdfDoc.pipe(res);
      pdfDoc.end();
    });
}

'use strict';
const Model = require('./../models/material.model');
const CustomError = require('./../utils/custom-error');
const mongoose = require('mongoose');
const PdfPrinter = require('pdfmake/src/printer');
const moment = require('moment');

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
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    quantity: req.body.quantity,
    measure: req.body.measure,
    holdQty: req.body.holdQty
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
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    quantity: req.body.quantity,
    measure: req.body.measure,
    holdQty: req.body.holdQty
  };

  Model.updateObject(req.params.id, data, (err, object)=>{
    if(err){return next(err);}

    res.status(200).json(object);
  })
};

module.exports.reportMaterial = (req, res, next)=>{
  let filename = 'materialReport';
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

    Model.fillReport({category: req.query.category}, (err, objects)=>{
      if(err){return next(err);}
      if(!objects){return next(new CustomError('No data found',400));}

      let objectsArray = new Array();
      objectsArray.push([{ text: 'Material', style: 'tableHeader' },
         { text: 'Disponible', style: 'tableHeader' },
         { text: 'En espera', style: 'tableHeader' },
         { text: 'Categoria', style: 'tableHeader' },
         { text: 'Medida', style: 'tableHeader' }
       ]);

      objects.map((object, index)=>{
        objectsArray.push([object.name.toString(),
            object.quantity.toString(),
            object.holdQty.toString(),
            object.category.toString(),
            object.measure.toString()
          ]);
      })


      const dd = {
        content:[
          { text: 'Entre Hilos & Agujas', style: 'subheader',  },
          { text: 'Reporte de materiales', style: 'header', alignment: 'center' },
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

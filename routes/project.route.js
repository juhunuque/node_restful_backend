'use strict';
const router = require('express').Router();
const controller = require('./../app/controllers/project.controller');

router.get('/', controller.getAll);

router.get('/:id', controller.getOneById);

router.post('/', controller.createObject);

router.delete('/:id', controller.removeObject);

router.put('/:id', controller.updateObject);

router.put('/status/:id', controller.updateStatus);

module.exports = router;

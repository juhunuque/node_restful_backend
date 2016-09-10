'use strict';
const router = require('express').Router();
const controller = require('./../app/controllers/catalog.controller');

router.get('/', controller.getAll);

router.get('/:id', controller.getOneById);

router.post('/', controller.createObject);

router.delete('/:id', controller.removeObject);

router.put('/:id', controller.updateObject);

module.exports = router;

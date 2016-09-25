'use strict';
const router = require('express').Router();
const controller = require('./../app/controllers/security.controller');

router.get('/:id', controller.restartUserPwd);
router.post('/:id', controller.updateUserPwd);

module.exports = router;

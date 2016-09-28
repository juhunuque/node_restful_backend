'use strict';
let router = require('express').Router();
const controller = require('./../app/controllers/security.controller');

router.get('/restart/:id', controller.restartUserPwd);
router.post('/:id', controller.updateUserPwd);
router.get('/backup', controller.backupDb);

module.exports = router;

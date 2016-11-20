'use strict';
let router = require('express').Router();
const controller = require('./../app/controllers/security.controller');

router.get('/restart/:id', controller.restartUserPwd);
router.post('/:id', controller.updateUserPwd);
router.get('/backup', controller.backupDb);
router.post('/restore/db', controller.restoreDb);

module.exports = router;

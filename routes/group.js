const express = require('express');

const router = express.Router();

const userauthentication = require('../middleware/auth');
const controller = require('../controller/group');

router.post('/new-group/:id',userauthentication.authenticate,controller.createGroup);

//router.get('/group-list',userauthentication.authenticate,controller.getGroupList);

router.get('/group-list/:id',userauthentication.authenticate,controller.getUsersGroupList);

module.exports = router;
const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

router.post('/signup',userController.addUser);
router.post('/login',userController.getLogin);

module.exports = router;
const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

router.post('/signup',userController.addUser);
<<<<<<< HEAD
=======
router.post('signup/:groupid',userController.addUser);

>>>>>>> 76d2c29 (multiple groups)
router.post('/login',userController.getLogin);

module.exports = router;
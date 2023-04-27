const express = require("express");

const router = express.Router();

const controller = require('../controller/chat')
const userauthentication = require('../middleware/auth');

<<<<<<< HEAD
router.get('/get-messages',userauthentication.authenticate,controller.getMessages);

router.get('/get-message/:id',userauthentication.authenticate,controller.getMessage);
=======
//router.get('/get-messages',userauthentication.authenticate,controller.getMessages);

router.get('/get-message/:lastmsgid/:groupid',userauthentication.authenticate,controller.getGroupMessage);

router.post('/post-message/:groupid',userauthentication.authenticate,controller.postGroupMessage);

router.get('/get-message/:lastmsgid',userauthentication.authenticate,controller.getMessage);
>>>>>>> 76d2c29 (multiple groups)

router.post('/post-message',userauthentication.authenticate,controller.postMessage);

module.exports = router;
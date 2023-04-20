const express = require("express");

const router = express.Router();

const controller = require('../controller/chat')
const userauthentication = require('../middleware/auth');

router.get('/get-messages',userauthentication.authenticate,controller.getMessages);

router.get('/get-message/:id',userauthentication.authenticate,controller.getMessage);

router.post('/post-message',userauthentication.authenticate,controller.postMessage);

module.exports = router;
const express = require("express");

const router = express.Router();

const controller = require('../controller/chat')
const userauthentication = require('../middleware/auth');

router.get('/get-messages',userauthentication.authenticate,controller.getMessages);

router.post('/post-message',userauthentication.authenticate,controller.postMessage);

module.exports = router;
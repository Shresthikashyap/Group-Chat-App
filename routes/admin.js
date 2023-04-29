const express = require("express");

const router = express.Router();

const controller = require('../controller/admin')
const userauthentication = require('../middleware/auth');


router.get('/memberlist/:groupId',userauthentication.authenticate,controller.getMembers);

router.get('/checkadmin/:userId/:groupId',userauthentication.authenticate,controller.checkAdmin);

router.get('/removeuser/:userId/:groupId',userauthentication.authenticate,controller.removeMember);

router.get('/changeadmin/:userId/:groupId',userauthentication.authenticate,controller.changeAdmin);

module.exports = router;
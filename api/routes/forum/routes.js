const router = require('express').Router();

//Forum Handler
router.get("/", require('./checkForum'));
router.post("/create", require('./createForumHandler'));
router.delete("/:topic/delete", require('./deleteForum'));

//Message Handler
router.get("/:topic", require('./checkMessagesHandler'));
router.post("/:topic/message/post", require('./createMessage'));
router.delete("/:topic/message/:id/delete", require('./deleteMessage'));

module.exports = router;
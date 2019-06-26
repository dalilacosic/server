var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Message = require('../models/messages');
const Room = require('../models/room');
const sanitizeUser = require('../utils/sanitzeUser');

router.post('/test', async (req, res, next) => {
  let room = new Room({
    type: req.body.type,
    users: req.body.users,
  });
  try {
    let createdRoom = await room.save();
    res.json(createdRoom);
  } catch (e) {
    if(e.status === 400) res.status(e.status).json({message: e.message});
    else tres.status(500).json(e);
  }
});
router.post('/test2', async (req, res, next) => {
  try {
    let createdRoom = await Room.findByIdAndUpdate({_id: req.body._id, users: { $ne: req.body.user }},
      {$addToSet: {users: req.body.user }},
      { new : true}
      );
    res.json(createdRoom);
  } catch (e) {
    if(e.status === 400) res.status(e.status).json({message: e.message});
    else res.status(500).json(e.message);
  }
});


router.get('/:room/all', async (req, res, next) => {
  console.log(req.param);
  console.log(req.params);
  try{
    const messages = await Message.find({room: req.params.room}).populate({ path: 'from', select:' _id username'});
    res.json({messages});
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Internal error'});
  }
});

router.post('/create', async (req, res, next) => {
  const message = new Message( { content: req.body.content , from: req.user._id, room: req.body.room });
  req.checkBody('content', 'Can\'t insert empty message').notEmpty().escape();
  req.checkBody('room', 'Can\'t message with non existing room').notEmpty().escape();
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
  } else {
    try {
      const createdMessage = await message.save();
      const room = await Room.findByIdAndUpdate({_id:req.body.room },{
        $push:{messages: createdMessage._id}
      });
      res.json({msg: 'Success'});
    } catch (err) {
      res.status(500).json({msg: err.message || 'Internal error'});
    }
  }
});

module.exports = router;

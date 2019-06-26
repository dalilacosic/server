var express = require('express');
var router = express.Router();
const Room = require('../models/room');
const User = require('../models/users');
const mongoose = require('mongoose');
router.post('/private', async (req, res, next) => {
  try {
    let room = await Room.findOne({users:{}})
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get('/group', async (req, res, next) => {
  const type = 'group';
  const userId = req.user._id;
  try {
    let room = await Room.findOneAndUpdate({ $and :[{type}, {users: {$elemMatch: {$ne: userId }}}]},
      {$addToSet: {users: userId}},
      {new: true}).select('_id createdAt')
      .populate({
        path:'messages',
        select:'_id content createdAt',
        options:{
          sort:{createdAt: -1}
          }
        , populate:{path:'from', select:' _id username'}});

    if(!room){
      let newRoom = new Room({
        type,
        users: userId,
      });
      room = await newRoom.save().select('_id createdAt').populate({path:'messages', populate:{path:'from', select:' _id username'}});
    }
    await User.findByIdAndUpdate({_id: userId},
      {$addToSet: {rooms: room._id}},
      {new: true});
    res.json({room });
  } catch (e) {
    console.log(e.message);
    res.status(500).json(e);
  }
});

module.exports = router;

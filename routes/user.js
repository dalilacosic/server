var express = require('express');
var router = express.Router();
const User = require('../models/users');
const sanitizeUser = require('../utils/sanitzeUser');


router.get('/me', (req, res, next) => {
  res.status(200).json({user:{_id: req.user._id, name:req.user.username }});
});

router.get('/all', async (req, res, next) => {
  try {
    const result = await User.find({ _id : { $ne: req.user._id } } );
    const users = sanitizeUser(result);
    res.status(200).json({ users });
  } catch(err) {
    res.status(500).json({ msg:'Internal server error' });
  }
});

router.put('/location', async (req, res, next) => {
  const { longitude, latitude } = req.body;
  try{
  const updatedCoords = await User.findByIdAndUpdate(req.user._id, { longitude, latitude });
  res.status(200).json({ coords: { longitude, latitude } });
  } catch(err){
    console.log(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;

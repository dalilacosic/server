var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path');

router.post('/', upload.single('avatar'),(req, res, next) => {
  console.log(req.file);
  res.send('Success');
});

router.get('/',(req, res, next) => {
  res.sendFile(path.resolve('uploads/a7b670eb0be872453ca181a7d6928e42.png'));
});

module.exports = router;

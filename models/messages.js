const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String, default: undefined },
  from: { type: Schema.Types.ObjectId , ref: 'User'},
  room: { type: Schema.Types.ObjectId, ref: 'Room'}
},{
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
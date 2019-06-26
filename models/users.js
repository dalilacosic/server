const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const encrypt = require('../utils/encrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, default: undefined},
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {type: String, required: true },
  longitude: { type: mongoose.Schema.Types.Double },
  latitude: { type: mongoose.Schema.Types.Double },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room'}]
},{
  timestamps: true
});
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password'))
    this.password = await encrypt(this.password);
  next();
});

module.exports = mongoose.model('User', userSchema);
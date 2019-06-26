const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  type: { type: String,
    required: true,
    enum: ['group', 'private'],
  },
  users: [{ type: Schema.Types.ObjectId , ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
},{
  timestamps: true,
});
roomSchema.pre('save', function () {
  return new Promise(async (resolve, reject) => {
    let exists;
    console.log(this);
    if(!this.users.length) reject({status: 400, message: 'Can not create empty room!'});
    else if(this.type === 'group'){
      try {
        exists = await this.constructor.find({type: this.type });
        if(exists.length) reject({status: 400, message: 'Can not create multiple group rooms!'})
      } catch (e) {
        reject(e);
      }
    }
    else if(this.type === 'private' && this.users.length > 2)
      reject({status: 400, message: 'Size on users exceeded for private room'});
    resolve(this);
  });
});
roomSchema.pre('update',(next) => {
  console.log(this);
  next();
});
module.exports = mongoose.model('Room', roomSchema);
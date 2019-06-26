const Room = require('../../models/room');

module.exports = {
  join: async ({ _id } , socket) => {
    try {
      console.log(_id);
      let room = await Room.findOne({ _id });
      //if room exists add new user to room
      if (room) {
        //check if user is already added to room
        socket.join(_id);
      //if room doesn't exist create new room and add user to it
      } else {
        socket.emit('err',{status: 400, message:'No such room!'});
      }
    } catch (e) {
      console.log(e.message);
      socket.emit('err', {error: e || e.message});
    }
  }
};
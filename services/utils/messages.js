const Room = require('../../models/room');
const Message = require('../../models/messages');

module.exports = {
  newMessage: async({message, room}, socket) => {
    console.log(message);
    try{
      let newMessage = await new Message({
        content: message.text,
        from: message.user._id,
        room
      }).save();
      let newRoom = await Room.findByIdAndUpdate({_id: room},
        {$push: {messages: newMessage._id}},
        {new: true});
      socket.to(newRoom._id).emit('newMessage',message);
    } catch (e) {
      console.log(e);
    }
  }
};
const roomHandler = require('./utils/room');
const messageHandler = require('./utils/messages');
module.exports = {
  joinRoom: async ({ room }, socket) => {
    if (!room)
      socket.emit('err', {error: 'Invalid parameters.' });
    else
      roomHandler.join({_id: room}, socket);
  },
   newMessage: async ({messages, room},socket) => {
    console.log(room);
     if (!room || !messages.length)
       socket.emit('err', {error: 'Invalid parameters.' });
      else
        messageHandler.newMessage({message: messages[0], room}, socket);
   }
};


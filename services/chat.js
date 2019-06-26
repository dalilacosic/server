const chat = require('./chatHandlers');

module.exports = (io) =>{

  io.on('connection', (socket) => {
    console.log('Socket connected');
    //TODO: separate join group and join private
    socket.on('joinRoom', (data) => chat.joinRoom(data,socket));
    socket.on('new_message', (data) => chat.newMessage(data,socket));
    socket.on('disconnect', (event) => {
      console.log('Disconnected',event);
    });
  });
};